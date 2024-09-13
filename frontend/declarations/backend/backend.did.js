export const idlFactory = ({ IDL }) => {
  const Category = IDL.Record({ 'name' : IDL.Text, 'description' : IDL.Text });
  return IDL.Service({
    'addCategory' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'getCategories' : IDL.Func([], [IDL.Vec(Category)], ['query']),
    'initializeCategories' : IDL.Func([], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
