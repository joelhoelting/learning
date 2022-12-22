Union types let us write functions that are very flexible, but also lead to some awkwardness when used. In this lesson we'll see an example of that awkwardness, then we'll see how TypeScript's function overload feature can fix it. Our example here will be contrived, but in a future lesson we'll see how to apply function overloads to a more realistic example.

Suppose that we want to write a double function that works on both numbers and strings. When given a number, double should return twice that number. When given a string, double should turn it into a number, double it, and then turn it back into a string. We can do this with type unions.

>

function double(n: number | string) {
  if (typeof n === 'number') {
    return n * 2;
  } else {
    const doubled = Number(n) * 2;
    return doubled.toString();
  }
}

>

[double(5), double('6')];

Result:

[10, '12']

That works, but there's a problem. The inferred return type of double is number | string. If we try to assign double's return value to a number variable or a string variable, we'll get a type error.

>

const n: number = double(5);
n;

Result:

type error: Type 'string | number' is not assignable to type 'number'.
  Type 'string' is not assignable to type 'number'.

>

const n: string = double('6');
n;

Result:

type error: Type 'string | number' is not assignable to type 'string'.
  Type 'number' is not assignable to type 'string'.

We can't solve this problem using the TypeScript features that we've seen so far. However, there is a solution: function overloads.

In TypeScript, "overload" means "provide multiple type signatures for a single function". For our double function, we want one signature of (n: number) => number and a second signature of (n: string) => string. Then we want to write a single function implementation to handle both of those cases.

We define each of the overloaded type signatures separately, as if they were their own functions. Then we define the actual function implementation, whose type must be compatible with each of the overloads.

>

function double(n: number): number;
function double(s: string): string;
function double(n: number | string): number | string {
  if (typeof n === 'number') {
    return n * 2;
  } else {
    const doubled = Number(n) * 2;
    return doubled.toString();
  }
}

>

const n: number = double(5);
n;

Result:

10

>

const s: string = double('6');
s;

Result:

'12'

That example contained one function, but with two overloads. The overloads must come immediately before the function body. We can also write functions with more than two overloads, but we'll stick to two overloads for now.

When TypeScript type checks the code above, it searches for the overload that matches our argument types. If we pass in a number, we get the function double(n: number): number overload. That tells TypeScript that we'll get a number back, which in turn allows us to assign it to our number variable. But we only have one function body, so that body is called at runtime whether we pass a number or a string.

As for the type safety of overloads, there's good news and bad news.

The good news is that TypeScript tells us when the overload signatures' types are incompatible. There's only one function body, so it has to work regardless of which overloaded signature we're using. If we make a mistake, and our function body's type isn't compatible with one of the overloads, then we'll get a type error message telling us that.

In the example above, the main function body's return type was number | string, which is compatible with the two overloads' return types: number and string. But in the example below, we've changed the main function's type signature to just number. That's incompatible with the second overload signature's string return type.

>

function double(n: number): number;
function double(s: string): string;
function double(n: number | string): number {
  if (typeof n === 'number') {
    return n * 2;
  } else {
    const doubled = Number(n) * 2;
    return doubled.toString();
  }
}

double(5);

Result:

type error: This overload signature is not compatible with its implementation signature.

That was the good news. The bad news is that TypeScript will let us make serious mistakes inside the body of the function. For example, our second overload signature says "double will return a string when given a string". But we can make a mistake where it actually returns a number when given a string. TypeScript won't catch that mistake, so our static types are violated at runtime.

(The function below is the same as the ones above, except that we no longer call .toString() when given a string argument.)

>

function double(n: number): number;
function double(s: string): string;
function double(n: number | string): number | string {
  if (typeof n === 'number') {
    return n * 2;
  } else {
    const doubled = Number(n) * 2;
    return doubled;
  }
}

// This is supposed to be a string, but it ends up holding a number!
const s: string = double('6');
s;

Result:

12

TypeScript checks the overload signatures against the main function signature, which is good. TypeScript also checks the function body's code against the main function signature, which is also good.

But as the example above shows, these two checks aren't good enough; there's still a big gap in the types. The gap exists because TypeScript can't check the function's code against the individual overload signatures. It can't tell that our else branch is supposed to handle the double(s: string): string case. It only checks that our function returns a number | string, which it does.

Here's a code problem:

The pluralize function below pluralizes strings. It also allows an argument of undefined. When we try to pluralize undefined, it should return undefined.

Currently, this function has a return type of string | undefined. That works, but it causes type errors in some reasonable-looking calls to our function. For example, const cats: string = pluralize('cat') is a type error.

Add two overload signatures to the function. One should say "the function returns a string when given a string". The other should say "it returns an undefined when given an undefined". You don't need to change the existing function definition in any way, including its signature; you only need to add overload signatures.

function pluralize(s: string): string;

function pluralize(s: undefined): undefined;

function pluralize(s: string | undefined): string | undefined {

  return s === undefined ? undefined : s + 's';

}

const cats: string = pluralize('cat');

const dogs: string = pluralize('dog');

const anUndefined: undefined = pluralize(undefined);

[cats, dogs, anUndefined];

Goal:

    ['cats', 'dogs', undefined]

Yours:

    ['cats', 'dogs', undefined]

Show Author's Answer

To sum this lesson up: function overloads are a huge trade-off in TypeScript. They give us the power to write functions that return very specific types depending on different argument types. But TypeScript will sometimes let us write function bodies that contradict the overload signature types.

Our recommendation is: when using function overloads, tread very carefully. It's probably best to avoid them unless they solve a serious problem in your system.
