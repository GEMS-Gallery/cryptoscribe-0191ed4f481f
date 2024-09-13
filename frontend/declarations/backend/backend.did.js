export const idlFactory = ({ IDL }) => {
  const Category = IDL.Record({ 'name' : IDL.Text, 'description' : IDL.Text });
  const Post = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'content' : IDL.Text,
    'categoryName' : IDL.Text,
    'author' : IDL.Text,
    'timestamp' : IDL.Int,
  });
  return IDL.Service({
    'addCategory' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'addPost' : IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text], [], []),
    'getCategories' : IDL.Func([], [IDL.Vec(Category)], ['query']),
    'getPosts' : IDL.Func([IDL.Text], [IDL.Vec(Post)], ['query']),
    'initializeCategories' : IDL.Func([], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
