Suppose that we have a number | undefined property, but we want to use it as a number. If we try to do that directly, it's a type error: number | undefined isn't assignable to number.

>

type User = {name: string, age: number | undefined};
const amir: User = {name: 'Amir', age: 36};

const age: number = amir.age;
age;

Result:

type error: Type 'number | undefined' is not assignable to type 'number'.
  Type 'undefined' is not assignable to type 'number'.

With conditional narrowing, we can narrow the age to just a number. In the next example, we do that by using typeof as a type guard.

>

type User = {name: string, age: number | undefined};
const amir: User = {name: 'Amir', age: 36};

let age: number;
if (typeof amir.age === 'number') {
  age = amir.age;
} else {
  age = 0;
}
age;

Result:

36

typeof works when we have a basic type like number. But what if we need a type guard for a complex type, like a nested object type with many properties? In this lesson, we'll see the answer: TypeScript lets us write "type predicates", which let us write our own functions that act as type guards.

We'll write an isAddress function as our example. Our first attempt is a regular function that returns a boolean.

>

type Address = {postalCode: string, country: string};
type User = {name: string, address: Address | undefined};

function isAddress(address: Address | undefined): boolean {
  return address !== undefined;
}

isAddress takes a Address | undefined, so its body only needs to check for address !== undefined. If the argument isn't an undefined, we know it must be a Address. But if address allowed more types in its union, we'd need a more complex conditional.

We can see that isAddress only returns true when its argument is actually an address. However, nothing in our function tells the TypeScript compiler about that. If we try to do if (isAddress(address)), it doesn't act as a type guard. The variable's type is still Address | undefined, so trying to assign it to another variable of type Address is still a type error.

>

type Address = {postalCode: string, country: string};
type User = {name: string, address: Address | undefined};

function isAddress(address: Address | undefined): boolean {
  return address !== undefined;
}

const amir: User = {
  name: 'Amir',
  address: {postalCode: '75010', country: 'France'}
};

let address: Address;
if (isAddress(amir.address)) {
  address = amir.address;
} else {
  address = {postalCode: 'unknown', country: 'unknown'};
}
address.postalCode;

Result:

type error: Type 'Address | undefined' is not assignable to type 'Address'.
  Type 'undefined' is not assignable to type 'Address'.

A regular boolean function like isAddress above doesn't act as a type guard. However, with one small change it can.

The next example is identical to the previous one, but with one small difference. We've changed isAddress's return type from boolean to address is Address. With that change, isAddress becomes a type predicate. Now it works as a type guard!

>

type Address = {postalCode: string, country: string};
type User = {name: string, address: Address | undefined};

function isAddress(address: Address | undefined): address is Address {
  return address !== undefined;
}

const amir: User = {
  name: 'Amir',
  address: {postalCode: '75010', country: 'France'}
};

let address: Address;
/* Calling `isAddress` narrows the type of `amir.address` because it's a
 * type predicate. */
if (isAddress(amir.address)) {
  address = amir.address;
} else {
  address = {postalCode: 'unknown', country: 'unknown'};
}
address.postalCode;

Result:

'75010'

The only new part here is the address is Address in place of a return value. That's the type predicate: it lets our function serve as a type guard.

You can think of address is Address in the return type as answering the question: "is address a Address?" If isAddress(...) returns true, it tells the compiler that address has the type Address from then on. If it returns false, the types stay the same.

Where does the term "type predicate" come from? In general, a predicate ("preh-dih-kit") function is any function that returns a boolean. Type predicates are predicate functions that also change their arguments' static types.

Returning to our example, the upgraded isAddress still works as a regular boolean function:

>

type Address = {postalCode: string, country: string};
function isAddress(address: Address | undefined): address is Address {
  return address !== undefined;
}
isAddress({postalCode: '75010', country: 'France'});

Result:

true

Here's a code problem:

Add a type predicate to the isAlbum function so it works as a type guard. (You won't need to change the function's body.)

type Album = {name: string, copiesSold: number};

type Artist = {name: string, topSellingAlbum: Album | undefined};

function isAlbum(maybeAlbum: Album | undefined): maybeAlbum is Album {

  return maybeAlbum !== undefined;

}

const artist: Artist = {

  name: 'Pink Floyd',

  topSellingAlbum: {

    name: 'The Dark Side of the Moon',

    copiesSold: 24400000,

  },

};

​

let album: Album;

if (isAlbum(artist.topSellingAlbum)) {

  album = artist.topSellingAlbum;

} else {

  album = {name: 'unknown', copiesSold: 0};

}

​

album;

Goal:

    {name: 'The Dark Side of the Moon', copiesSold: 24400000}

Yours:

    {name: 'The Dark Side of the Moon', copiesSold: 24400000}

Show Author's Answer

Type narrowing is a common challenge in TypeScript, and we solve it with type guards. We've now seen a few different kinds of type guards:

    Directly checking the type with the typeof operator, like typeof aValue === 'number'.
    Comparing against a value, like aValue !== undefined.
    Type predicate functions like the built-in Array.isArray(), or the isAddress that we wrote above.

Some type predicates like Array.isArray come with the TypeScript compiler. However, they're implemented using the same type predicate syntax that we saw above. The only special thing about them is that they're defined in files that come with TypeScript itself.

Two quick notes to wrap up this lesson. First, the term "type predicate" sometimes refers specifically to the address is Address syntax. Other times, "type predicate" refers to an entire function using that return type syntax. We'll use it in both ways in this course.

Second, let's recap the terminology, since there's a lot of it. We've seen type narrowing, type guards, and type predicates.

    Type narrowing lets us write separate code to handle union alternatives. For example, if we have a number | undefined variable, we can write separate code to handle the number case vs. the undefined case.
    Type guards are special expressions used inside of if conditions, like if (Array.isArray(...)) or if (typeof n === 'number'). We use them to narrow types. They also work inside switch statements and ternary expressions like typeof x === 'number' ? x : y.
    Type predicates let us write our own functions that act as type guards. TypeScript comes with some type predicates predefined, like Array.isArray, but we can define our own as well.

