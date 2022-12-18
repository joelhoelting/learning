type User = {
  name: string;
  age: number;
};

function getUserProperty(user: User, key: "name" | "age") {
  return user[key];
}

getUserProperty({ name: "Amir", age: 36 }, "name");

// Result: 'Amir'

getUserProperty({ name: "Amir", age: 36 }, "age");

// Result: 36

// If we ask for a property name that isn't in the type, that's a type error. It violates our function's 'name' | 'age' parameter type.

getUserProperty({ name: "Amir", age: 36 }, "isAdmin");

// Result: type error: Argument of type '"isAdmin"' is not assignable to parameter of type '"name" | "age"'.

// That function is easy to write because we can see the User type. It has the properties "name" and "age", so the function's key parameter is a 'name' | 'age'.

// Now imagine that we want a generic version of our function: getProperty<T>(obj: T, key: ???). There's no way to know what property keys T will have in advance. When T is User, the key type is 'name' | 'age'. But when T is Album, the key type might need to be 'albumName' | 'copiesSold'.

// The solution here is TypeScript's keyof type operator. It gives us an object type's property names as a union of literal strings. For example, keyof {name: string, age: number} is the type 'name' | 'age'.

function getProperty<T>(obj: T, propertyName: keyof T) {
  return obj[propertyName];
}

const name: string = getProperty({ name: "Amir", hello: "world" }, "hello");
const age: number = getProperty({ age: 36 }, "age");
[name, age];
