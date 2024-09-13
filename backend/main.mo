import Func "mo:base/Func";
import Text "mo:base/Text";

import Array "mo:base/Array";
import List "mo:base/List";

actor {
  // Define the Category structure
  public type Category = {
    name: Text;
    description: Text;
  };

  // Use a stable variable to store categories
  stable var categories : List.List<Category> = List.nil();

  // Function to add a new category
  public func addCategory(name: Text, description: Text) : async () {
    let newCategory : Category = {
      name = name;
      description = description;
    };
    categories := List.push(newCategory, categories);
  };

  // Function to get all categories
  public query func getCategories() : async [Category] {
    List.toArray(categories)
  };

  // Initialize with default categories
  public func initializeCategories() : async () {
    let defaultCategories = [
      { name = "Red Team"; description = "Offensive security techniques and strategies" },
      { name = "Penetration Testing"; description = "Methods for testing system vulnerabilities" },
      { name = "Exploit Development"; description = "Creating and sharing new exploits" },
      { name = "Cryptography"; description = "Encryption, decryption, and secure communication" },
      { name = "Social Engineering"; description = "Psychological manipulation tactics" },
      { name = "Malware Analysis"; description = "Studying and reverse engineering malicious software" },
    ];

    for (category in defaultCategories.vals()) {
      await addCategory(category.name, category.description);
    };
  };
}