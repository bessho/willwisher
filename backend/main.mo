import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";
import FileStorage "file-storage/file-storage";
import MultiUserSystem "auth-multi-user/management";

persistent actor WillWisher {
    type WillData = {
        testatorName : Text;
        executorName : Text;
        alternateExecutorName : Text;
        guardianName : Text;
        alternateGuardianName : Text;
        specificGifts : [(Text, Text)]; // (Beneficiary, Item)
        residuaryBeneficiaries : [(Text, Nat)]; // (Beneficiary, Percentage)
        witnesses : [Text];
        completionStatus : Nat; // Percentage of completion
    };

    type WillDraft = {
        id : Text;
        data : WillData;
        lastModified : Int;
    };

    type TrustData = {
        trustorName : Text;
        trusteeName : Text;
        successorTrusteeName : Text;
        trustName : Text;
        trustAssets : [(Text, Text)]; // (Type, Description)
        beneficiaries : [(Text, Nat)]; // (Name, Percentage)
        distributionTerms : Text;
        completionStatus : Nat;
    };

    type TrustDraft = {
        id : Text;
        data : TrustData;
        lastModified : Int;
    };

    type UserProfile = {
        principal : Principal;
        name : Text;
        email : Text;
    };

    transient let textMap = OrderedMap.Make<Text>(Text.compare);
    transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);

    var willDrafts : OrderedMap.Map<Text, WillDraft> = textMap.empty<WillDraft>();
    var trustDrafts : OrderedMap.Map<Text, TrustDraft> = textMap.empty<TrustDraft>();
    var userProfiles : OrderedMap.Map<Principal, UserProfile> = principalMap.empty<UserProfile>();
    var storage = FileStorage.new();
    var multiUserState = MultiUserSystem.initState();

    // Will Draft Functions
    public shared ({ caller }) func saveWillDraft(draftId : Text, willData : WillData) : async Result.Result<(), Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous users cannot save will drafts");
        };

        let draft : WillDraft = {
            id = draftId;
            data = willData;
            lastModified = Time.now();
        };

        willDrafts := textMap.put(willDrafts, draftId, draft);
        #ok();
    };

    public shared ({ caller }) func getWillDraft(draftId : Text) : async Result.Result<WillDraft, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous users cannot retrieve will drafts");
        };

        switch (textMap.get(willDrafts, draftId)) {
            case null { #err("Will draft not found") };
            case (?draft) { #ok(draft) };
        };
    };

    public shared ({ caller }) func deleteWillDraft(draftId : Text) : async Result.Result<(), Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous users cannot delete will drafts");
        };

        willDrafts := textMap.delete(willDrafts, draftId);
        #ok();
    };

    public shared ({ caller }) func getAllWillDrafts() : async Result.Result<[WillDraft], Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous users cannot retrieve will drafts");
        };

        let drafts = Iter.toArray(textMap.vals(willDrafts));
        #ok(drafts);
    };

    // Trust Draft Functions
    public shared ({ caller }) func saveTrustDraft(draftId : Text, trustData : TrustData) : async Result.Result<(), Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous users cannot save trust drafts");
        };

        let draft : TrustDraft = {
            id = draftId;
            data = trustData;
            lastModified = Time.now();
        };

        trustDrafts := textMap.put(trustDrafts, draftId, draft);
        #ok();
    };

    public shared ({ caller }) func getTrustDraft(draftId : Text) : async Result.Result<TrustDraft, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous users cannot retrieve trust drafts");
        };

        switch (textMap.get(trustDrafts, draftId)) {
            case null { #err("Trust draft not found") };
            case (?draft) { #ok(draft) };
        };
    };

    public shared ({ caller }) func deleteTrustDraft(draftId : Text) : async Result.Result<(), Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous users cannot delete trust drafts");
        };

        trustDrafts := textMap.delete(trustDrafts, draftId);
        #ok();
    };

    public shared ({ caller }) func getAllTrustDrafts() : async Result.Result<[TrustDraft], Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous users cannot retrieve trust drafts");
        };

        let drafts = Iter.toArray(textMap.vals(trustDrafts));
        #ok(drafts);
    };

    // User Profile Functions
    public shared ({ caller }) func saveUserProfile(name : Text, email : Text) : async Result.Result<(), Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous users cannot save profiles");
        };

        let profile : UserProfile = {
            principal = caller;
            name = name;
            email = email;
        };

        userProfiles := principalMap.put(userProfiles, caller, profile);
        #ok();
    };

    public shared ({ caller }) func getUserProfile() : async Result.Result<UserProfile, Text> {
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous users cannot retrieve profiles");
        };

        switch (principalMap.get(userProfiles, caller)) {
            case null { #err("User profile not found") };
            case (?profile) { #ok(profile) };
        };
    };

    // File Storage Functions
    public func listFiles() : async [FileStorage.FileMetadata] {
        FileStorage.list(storage);
    };

    // Multi-User System Initialization
    public shared ({ caller }) func initializeAuth() : async () {
        MultiUserSystem.initializeAuth(multiUserState, caller);
    };
};

