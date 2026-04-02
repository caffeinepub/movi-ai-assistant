import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Blob "mo:core/Blob";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Int "mo:core/Int";
import OutCall "http-outcalls/outcall";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  module SessionMessage {
    public func compare(s1 : SessionMessage, s2 : SessionMessage) : {#greater; #less; #equal} {
      Int.compare(s1.timestamp, s2.timestamp);
    };
  };

  module ChatSession {
    public func compare(c1 : ChatSession, c2 : ChatSession) : {#greater; #less; #equal} {
      Int.compare(c2.created, c1.created); // Sort newest first
    };

    public func compareByUserId(s1 : ChatSession, s2 : ChatSession) : {#greater; #less; #equal} {
      Text.compare(s1.title, s2.title);
    };
  };

  type Role = { #user; #assistant };

  type SessionMessage = {
    role : Role;
    content : Text;
    timestamp : Int;
  };

  type ChatSession = {
    id : Text;
    title : Text;
    messages : [SessionMessage];
    created : Int;
    lastUpdated : Int;
  };

  module SessionIdList {
    public func compare(a : (Principal, Text), b : (Principal, Text)) : {#greater; #less; #equal} {
      switch (a.0.compare(b.0)) {
        case (#equal) { a.1.compare(b.1) };
        case (other) { other };
      };
    };
  };

  // Core state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let sessions = Map.empty<(Principal, Text), ChatSession>();
  let starters = [
    "Summarize this article",
    "Plan my week",
    "Brainstorm app names",
    "Draft an email",
  ];
  var apiKey : Text = "";

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Helper function - create session
  func createSessionInternal(user : Principal, sessionId : Text, firstMessage : Text) : ChatSession {
    let timestamp = Time.now();
    {
      id = sessionId;
      title = firstMessage;
      messages = [];
      created = timestamp;
      lastUpdated = timestamp;
    };
  };

  // Public API

  public shared ({ caller }) func createSession(sessionId : Text, firstMessage : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create sessions");
    };
    if (sessions.containsKey((caller, sessionId))) {
      Runtime.trap("Session already exists");
    };
    let newSession = createSessionInternal(caller, sessionId, firstMessage);
    sessions.add((caller, sessionId), newSession);
  };

  public shared ({ caller }) func deleteSession(sessionId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete sessions");
    };
    if (not sessions.containsKey((caller, sessionId))) {
      Runtime.trap("Session does not exist");
    };
    sessions.remove((caller, sessionId));
  };

  public shared ({ caller }) func sendMessage(sessionId : Text, message : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };
    let timestamp = Time.now();
    let userMessage = {
      role = #user;
      content = message;
      timestamp;
    };
    switch (sessions.get((caller, sessionId))) {
      case (?session) {
        let updatedSession = {
          session with
          messages = session.messages.concat([userMessage]);
          lastUpdated = timestamp;
        };
        sessions.add((caller, sessionId), updatedSession);

        // Outcall to OpenAI-compatible API
        let response = await makeAICall(
          message,
          apiKey,
        );

        let assistantMessage = {
          role = #assistant;
          content = response;
          timestamp = Time.now();
        };

        let finalSession = {
          updatedSession with
          messages = updatedSession.messages.concat([assistantMessage]);
          lastUpdated = Time.now();
        };

        sessions.add((caller, sessionId), finalSession);
        response;
      };
      case (null) { Runtime.trap("Session not found") };
    };
  };

  public query ({ caller }) func getSessionMessages(sessionId : Text) : async [SessionMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access messages");
    };
    switch (sessions.get((caller, sessionId))) {
      case (?session) { session.messages };
      case (null) { Runtime.trap("Session not found") };
    };
  };

  public query ({ caller }) func getSessions() : async [ChatSession] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access sessions");
    };
    sessions.entries()
    .filter(func(((principal, _), _)) { principal == caller })
    .map(func((_, s)) { s })
    .toArray()
    .sort();
  };

  public query ({ caller }) func getStarters() : async [Text] {
    starters;
  };

  public shared ({ caller }) func setApiKey(key : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set the API key");
    };
    apiKey := key;
  };

  public shared ({ caller }) func getApiKey() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access the API key");
    };
    apiKey;
  };

  // HTTP outcall wrapper
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  func makeAICall(prompt : Text, key : Text) : async Text {
    let callBody : Text = "{" # "\"model\": \"gpt-4o-mini\"," # "\"messages\": " # "[{\"role\": \"user\", \"content\": \"" # prompt # "\"}]" # "}";

    let extraHeaders = [
      {
        name = "Authorization";
        value = "Bearer " # key;
      },
      {
        name = "Content-Type";
        value = "application/json";
      },
    ];

    let url = "https://api.openai.com/v1/chat/completions";
    await OutCall.httpPostRequest(url, extraHeaders, callBody, transform);
  };
};
