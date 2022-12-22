In an earlier lesson, we saw that there's a symmetry between JavaScript property access and TypeScript property type access. If we have an album object, we can get its name with album.name. If we have an Album type, we can get the type of its name property with Album['name']. That's a nice symmetry, but it breaks down when we go deeper into TypeScript.

If we have a User object type with "name" and "age" properties, TypeScript allows us to index it like User['name' | 'age']. This probably seems very strange at first. What does it mean to simultaneously access one property or another?

The answer is that TypeScript preserves the type union. If User is {name: string, age: number}, then User['name' | 'age'] is string | number. When we index an object type with a union, we get a union of those properties' types. This makes sense if we write it out in English: the type of "name or age" is "string or number".

>

type User = {
  name: string
  age: number
};

type NameOrAge = User['name' | 'age'];

Note: this code example reuses elements (variables, etc.) defined in earlier examples.

>

const nameOrAge: NameOrAge = 'Amir';
nameOrAge;

Result:

'Amir'

Note: this code example reuses elements (variables, etc.) defined in earlier examples.

>

const nameOrAge: NameOrAge = 36;
nameOrAge;

Result:

36

Note: this code example reuses elements (variables, etc.) defined in earlier examples.

>

const nameOrAge: NameOrAge = undefined;
nameOrAge;

Result:

type error: Type 'undefined' is not assignable to type 'NameOrAge'.

This also works when the union type is defined with its own name, as in the next example.

>

type User = {
  name: string
  age: number
};

type NameOrAgeKeys = 'name' | 'age';
type NameOrAge = User[NameOrAgeKeys];

const nameOrAge: NameOrAge = undefined;
nameOrAge;

Result:

type error: Type 'undefined' is not assignable to type 'NameOrAge'.

However, those types are really starting to look awkward! NameOrAge, NameOrAgeKeys... tracing through all of the names slows us down a lot.

Like many advanced type features, this one shouldn't be used often. In later lessons, we'll see situations where it's absolutely necessary. But you'll never need it for the types of simple objects like the ones above. When possible, it's better to just use simple types like string, number, or string | number.

Here's a teaser for what more advanced uses might look like. Suppose that our user is just a const variable, rather than a type. We can use typeof to get the inferred static type for the variable. Then we can use our union indexing trick on the typeof type.

>

const user = {
  name: 'Amir',
  age: 36,
};

type NameOrAge = (typeof user)['name' | 'age'];

const nameOrAge: NameOrAge = 'Betty';
nameOrAge;

Result:

'Betty'

That code example never explicitly said number or string! Still, the types are enforced, and NameOrAge is string | number.

Here's a code problem:

In the code below, we define an album variable with two properties: name (a string) and copiesSold (a number). We also define a NameOrCopiesSold type, but it's unfinished.

We want the NameOrCopiesSold type to be string | number. To avoid duplication, we don't want to write it down explicitly like that. Instead, we want to build that type by extracting the property types from album's type.

Modify this code to index album's type with a union of literal strings (a union of album's property keys). That will give us a union of the properties' types.

const album = {

  name: 'A Love Supreme',

  copiesSold: 500000,

};

type NameOrCopiesSold = (typeof album)['name' | 'copiesSold'];

const name: NameOrCopiesSold = album.name;

const copiesSold: NameOrCopiesSold = album.copiesSold;

[name, copiesSold];

Goal:

    ['A Love Supreme', 500000]

Yours:

    ['A Love Supreme', 500000]

Show Author's Answer

A final note about terminology. You probably learned the distributive property of addition in primary school:

>

[
  3 * (4 + 2),
  (3 * 4) + (3 * 2),
];

Result:

[18, 18]

We can "distribute" the 3, applying it to both sides of the 4 + 2. That always works, no matter what the numbers are.

Indexing a TypeScript type by a union is also distributive. This isn't a mere analogy; it's an accurate technical description of the type system!

Here's a rough equivalent to our arithmetic example above:

>

type User = {name: string, age: number};
type PropertyTypes1 = User['name' | 'age'];
type PropertyTypes2 = User['name'] | User['age'];

Result:

The types PropertyTypes1 and PropertyTypes2 are exactly the same type, string | number. When we do SomeObjectType[SomeUnionType], TypeScript distributes the object type across the union alternatives, just like when we see 3 * (4 + 2) and distribute the 3 across 4 + 2.
