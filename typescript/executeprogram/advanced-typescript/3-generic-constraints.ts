// Suppose that we want a function that gives us only the users under a certain age. It takes a User[] and a number as the age limit, then returns a User[].

type User = {
  name: string;
  age: number;
};

function filterBelowAge(users: User[], limit: number): User[] {
  return users.filter((user) => user.age < limit);
}

const users = [
  { name: "Amir", age: 36 },
  { name: "Gabriel", age: 7 },
];
const youngUsers = filterBelowAge(users, 10);
youngUsers.map((user) => user.name);

// Result: ['Gabriel']

// Now let's make it more difficult. We want our function to work on any object that has an age: number property. It should work for users, for cats, for buildings, for companies, and for any other object with an age. As a first attempt, we can try to use a union.

type User = { name: string; age: number; country: string };
type Cat = { name: string; age: number; vaccinated: boolean };

function filterBelowAge(
  things: Array<User | Cat>,
  limit: number
): Array<User | Cat> {
  return things.filter((thing) => thing.age < limit);
}

const peopleAndCats = [
  { name: "Amir", age: 36, country: "France" },
  { name: "Ms. Fluff", age: 4, vaccinated: true },
];

const youngOnly = filterBelowAge(peopleAndCats, 10);
youngOnly.map((thing) => thing.name);

// Result: ['Ms. Fluff']

// That seems to work, but there are two problems. First, it doesn't actually solve the problem that we set up! We wanted a function that works for any object with an age property, but this one only works for users and cats.

// Second, the Array<User | Cat> return type is a big problem. If we use filterBelowAge on an array of users, we expect to get an array of users back. Unfortunately, we'll always get an Array<User | Cat> instead. Trying to use it as an Array<User> is a type error.

const users: User[] = [{ name: "Amir", age: 36, country: "France" }];

const youngOnly: User[] = filterBelowAge(users, 10);

// Result:

// type error: Type '(User | Cat)[]' is not assignable to type 'User[]'.
//   Type 'User | Cat' is not assignable to type 'User'.
//     Property 'country' is missing in type 'Cat' but required in type 'User'.

// So much for that potential solution. Now let's sketch out what an ideal solution would look like.

// We want a function that works with any type that has age: number. The objects may have other properties too, but our function's body shouldn't be able to see those properties. From our function's perspective, everything should look like an {age: number}.

// However, our function should return the full type, not just {age: number}. If we pass an Array<User>, we want to get an Array<User> back, not an Array<{age: number}>. If we pass an Array<Cat>, we want an Array<Cat> back. Likewise for any other type, including types that didn't exist when we wrote the function.

// When a function needs to work with any type, we know that it must involve some kind of generic. As a first attempt, we'll add a simple <T> type parameter. The function now takes an Array<T> and returns an Array<T>. Unfortunately, nothing in that type says "these Ts will have an age property", so trying to access .age is a type error.

function filterBelowAge<T>(things: Array<T>, limit: number): Array<T> {
  return things.filter((thing) => thing.age < limit);
}

// Result: type error: Property 'age' does not exist on type 'T'.

// To solve this problem, we need a new TypeScript feature: generic constraints. Constraints let us say "this can be any type... as long as it's compatible with this other type". In our case, we want our function to take and return arrays of any type that's compatible with {age: number}.

// We do this by adding the generic constraint <T extends {age: number}>. In TypeScript, we can always add extends ... to a generic type parameter. Anywhere we can write <T>, we can also write <T extends ...>.

// function filterBelowAge<T extends {age: number}>(
//   things: Array<T>,
//   limit: number
// ): Array<T> {
//   return things.filter(thing => thing.age < limit);
// }

// Now our function works! When we pass an array of users, we get an array of users back. But we can also pass cats and get cats back, and likewise for any other object type that has an age.

type User = { name: string; age: number; country: string };

const allUsers: User[] = [
  { name: "Amir", age: 36, country: "France" },
  { name: "Gabriel", age: 7, country: "France" },
];
const youngUsers: User[] = filterBelowAge(allUsers, 10);
youngUsers.map((user) => user.name);

// Result: ['Gabriel']

type Cat = { name: string; age: number; vaccinated: boolean };

const allCats: Cat[] = [
  { name: "Ms. Fluff", age: 4, vaccinated: true },
  { name: "Wilford", age: 17, vaccinated: true },
];
const youngCats: Cat[] = filterBelowAge(allCats, 10);
youngCats.map((cat) => cat.name);

// Result: ['Ms. Fluff']

// Here's a mental model for thinking about generic constraints. They carve the world of types in half. There's the type world inside the function, and there's a separate type world outside.

// Inside the function, T always has the property age: number. That forces us to write the function in a way that works for any object with an age. Using the type in any other way is a type error. In our case, T extends {age: number} doesn't say anything about a name property, so accessing .name is a type error.

function filterBelowAge<T extends { age: number }>(
  things: Array<T>,
  limit: number
): Array<T> {
  return things.filter((thing) => thing.name === "Amir");
}

// Result: type error: Property 'name' does not exist on type 'T'.

// The function body's types are only checked once. If the function type checks, then the compiler continues. But our function might be called in many places: sometimes with users, sometimes with cats, sometimes with buildings. Each of those calls is type checked separately.

// Now we can see what generic constraints really do. They're a way to voluntarily constrain ourselves, so that we can only see a small piece of a type inside of the function. That allows our function to work with any type that has that piece. From the outside, it looks like our function was purpose-built for users or cats or buildings or companies. But in reality, it wasn't purpose-built for anything; it was written to work with any object that has an age.

// As usual, everything here is safe and the static types are enforced. If we try to pass objects without an age: number property, that's a type error.

// function filterBelowAge<T extends {age: number}>(
//   things: Array<T>,
//   limit: number
// ): Array<T> {
//   return things.filter(thing => thing.age < limit);
// }

// type Album = {name: string, copiesSold: number};

// const allAlbums: Album[] = [
//   {name: 'The Dark Side of the Moon', copiesSold: 24400000},
// ];
// filterBelowAge(allAlbums, 10).map(album => album.name);

// Result:

// type error: Argument of type 'Album[]' is not assignable to parameter of type '{ age: number; }[]'.
//   Property 'age' is missing in type 'Album' but required in type '{ age: number; }'.

// We've seen that our filterBelowAge function works, but what is the compiler actually doing when we call it? Here's a rough explanation, examining only the case where we pass an Array<User>.

//     The function's first parameter is declared as Array<T>. We're passing an Array<User>, so TypeScript infers that T in this case must be User.
//     But T is declared as <T extends {age: number}>. Does User satisfy {age: number}? Yes, it has the required age property, so we can continue.
//     The function's return type is Array<T>. We know that T is User, so in this case the function returns an Array<User>.
//     We're assigning the function's return value to a User[] variable. That's the same as the return type, Array<User>, so everything type checks.

// When we pass cats to filterBelowAge, TypeScript follows exactly the same process, but with cats instead of users.

// When you start learning TypeScript, problems like the one in this lesson can seem daunting. "How can I write a function that returns a user when given a user, returns a cat when given a cat, etc.?" It can seem impossible, which leads us to reach for any. But with any, we lose all type safety!

// With the generic constraints feature that we saw in this lesson, we solve that problem while retaining type safety. The function itself is fully type checked. When we call the function, that's fully type checked too. If we pass an array of users, we get an array of users back, with all of their properties intact.

// Here's a code problem:

// We're writing code to manage a veterinary office. So far, we have two types: Animal, which has a species property, and Appointment, which has an Animal. The Appointment type is generic: any animal can come in for an appointment.

// We also have a getAppointmentSpecies function: given an appointment, it should return the species of the animal coming in for that appointment. That function currently causes a type error: its generic constraint is missing. Add a generic constraint to fix that type error.

// (You don't need to change the body of the function here. You only need to add the generic constraint.)

type Animal = {
  species: string;
};

type Appointment<A extends Animal> = {
  animal: A;
};

function getAppointmentSpecies<A extends { species: string }>(
  appointment: Appointment<A>
) {
  return appointment.animal.species;
}

const appointment = {
  animal: {
    species: "felis catus",
    name: "Ms. Fluff",
  },
};

const species = getAppointmentSpecies(appointment);

species;

// Goal: 'felis catus'

// Yours: 'felis catus'

// Generic constraints are a critical feature of TypeScript, but they show up primarily in library or framework code. They're useful in situations like the one in this lesson, where we want to write code that relies on certain properties, but is also reusable in many situations.

// Here are some examples where generic constraints are useful:

//     A database library needs to work in any application, with any type of rows, but all rows must have a numeric ID. <T extends {id: number}>.
//     An API server framework needs to work with any server-side API endpoint that its users write. The endpoints can return any type of data, as long as the data is in JSON-compatible objects. <T extends Json>.
//     Heaps (and some other data structures) can only store data if it has a "key". Internally, the heap keeps data sorted by its key, but it doesn't need to access the rest of the data. A heap can store any data with a key, just as our filterBelowAge function could filter any array of things with ages. <T extends {key: number}>.

// We'll see more examples of generic constraints in future lessons.
