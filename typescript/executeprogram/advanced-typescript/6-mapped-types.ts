We've seen some ways to build types out of other types. As a simple example, A | B builds a new type out of the existing types A and B. The Partial utility type is a more complex example: it takes an object type, then builds a new object type where every property is optional. In this lesson, we'll see how Partial actually works, and how we can build our own utility types that do similar things.

We can think of Partial as "mapping" the object type's properties into a new set of properties. For each property in the original type, we'll get a corresponding property in the partial type. This is conceptually similar to the map method on arrays, which transforms existing values into new values.

>

[1, 2, 3].map(x => x * 2);

Result:

[2, 4, 6]

This isn't just an analogy! In TypeScript, types like Partial are called "mapped types", which we'll explore in this lesson. In a later lesson, we'll use this knowledge to reimplement Partial ourselves!

Our first example aggregates some data about users. We start with a regular User object type. We want to build a new type, UserAggregate. It should have all of the properties that User has, except that each of them is an array rather than a single value.

For example, if User has an email: string property, then UserAggregate should have an email: Array<string> property. That allows us to create a single UserAggregate object with all users' emails in its email property, all users' ages in its age property, etc.

First, here's the code. We'll discuss the new syntax afterward.

>

type User = {
  email: string
};

type UserAggregate = {
  [K in keyof User]: Array<string>
};

const userAggregate: UserAggregate = {
  email: ['amir@example.com'],
};
userAggregate.email;

Result:

['amir@example.com']

In our UserAggregate type, we "map over" the properties of User with [K in keyof User]. We saw the keyof type operator in an earlier lesson. It gives us a union of an object type's property names, each as a literal string type.

For our User type above, keyof User is just 'email'. In a moment, we'll extend User to {email: string, age: number}, and at that point keyof User will be 'email' | 'age'.

UserAggregate has the same property names (keys) as the original User type. But in the new type, each property's type is Array<string>. Our UserAggregate type is exactly equivalent to the type {email: Array<string>}.

Because we're mapping over the object type's keys, our mapped type works equally well for one key or a hundred keys. In the next example, our object type has two properties, "email" and "age". Our mapped type changes both properties' types.

Note that the mapped type here blindly changes both properties to Array<string>, even though age was originally a number. Our age array will be ['36'], not [36]. We'll fix that in a moment!

>

type User = {
  email: string
  age: number
};

type UserAggregate = {
  [K in keyof User]: Array<string>
};

const userAggregate: UserAggregate = {
  email: ['amir@example.com'],
  age: ['36'],
};
userAggregate;

Result:

{email: ['amir@example.com'], age: ['36']}

The age property in that type doesn't make sense. Ages are numbers, so we want our aggregate age property to be an Array<number>.

Fortunately, our mapped type can reference each property's original type with User[K]. We can use that to wrap the original type, like Array<User[K]>. In the next example, User once again has one string property and one number property. Our mapped type wraps those original types in Array<...>, so the properties' types are Array<string> and Array<number>.

>

type User = {
  email: string
  age: number
};

type UserAggregate = {
  [K in keyof User]: Array<User[K]>
};

const userAggregate: UserAggregate = {
  email: ['amir@example.com'],
  age: [36],
};
userAggregate;

Result:

{email: ['amir@example.com'], age: [36]}

>

type User = {
  email: string
  age: number
};

type UserAggregate = {
  [K in keyof User]: Array<User[K]>
};

const userAggregate: UserAggregate = {
  email: 'amir@example.com',
  age: 36,
};
userAggregate;

Result:

type error: Type 'string' is not assignable to type 'string[]'.

When we add new properties to the User type, UserAggregate will automatically get corresponding properties, each of which is an array of the original property's type. We don't have to modify UserAggregate at all. For example, if we add a new property catNames: Array<string> to User, then UserAggregate automatically gets a new property catNames: Array<Array<string>>.

Our mapped types above used K for the key, like [K in keyof User]. Two quick notes about that.

First, we capitalize K because it's also a type. As our mapped type maps over the properties, K gets each of the individual property types as a literal string type. First it gets the literal type 'email', then it gets the literal type 'age'. That's why we can access User[K]: it's as if we're accessing User['email'], followed by User['age'].

Second, there's nothing special about the name K. It's just a common choice, short for "key". Another common choice is P for "property". But we could also write [UserProp in keyof User]: Array<User[UserProp]>. This is a style decision, like variable names or function names.
