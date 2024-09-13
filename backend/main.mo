import Bool "mo:base/Bool";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import Text "mo:base/Text";

import Array "mo:base/Array";
import List "mo:base/List";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";

actor {
  public type Category = {
    name: Text;
    description: Text;
  };

  public type Post = {
    id: Nat;
    categoryName: Text;
    title: Text;
    content: Text;
    author: Principal;
    timestamp: Int;
  };

  stable var categories : List.List<Category> = List.nil();
  stable var posts : List.List<Post> = List.nil();
  stable var nextPostId : Nat = 0;

  public shared(msg) func addCategory(name: Text, description: Text) : async () {
    assert(not Principal.isAnonymous(msg.caller));
    let newCategory : Category = {
      name = name;
      description = description;
    };
    categories := List.push(newCategory, categories);
  };

  public query func getCategories() : async [Category] {
    List.toArray(categories)
  };

  public shared(msg) func addPost(categoryName: Text, title: Text, content: Text) : async Result.Result<(), Text> {
    if (Principal.isAnonymous(msg.caller)) {
      Debug.print("Anonymous user tried to add a post");
      return #err("User must be authenticated to add a post");
    };
    
    let newPost : Post = {
      id = nextPostId;
      categoryName = categoryName;
      title = title;
      content = content;
      author = msg.caller;
      timestamp = Time.now();
    };
    posts := List.push(newPost, posts);
    nextPostId += 1;
    #ok()
  };

  public query func getPosts(categoryName: Text) : async [Post] {
    List.toArray(List.filter(posts, func (p: Post) : Bool { p.categoryName == categoryName }))
  };

  public func initializeCategories() : async () {
    if (List.isNil(categories)) {
      let defaultCategories = [
        { name = "Red Team"; description = "Offensive security techniques and strategies" },
        { name = "Penetration Testing"; description = "Methods for testing system vulnerabilities" },
        { name = "Exploit Development"; description = "Creating and sharing new exploits" },
        { name = "Cryptography"; description = "Encryption, decryption, and secure communication" },
        { name = "Social Engineering"; description = "Psychological manipulation tactics" },
        { name = "Malware Analysis"; description = "Studying and reverse engineering malicious software" },
      ];

      for (category in defaultCategories.vals()) {
        categories := List.push(category, categories);
      };
    };
  };

  public shared(msg) func whoami() : async Principal {
    return msg.caller;
  };
}