TypeScript lets us union a type with never, but it has no effect. For example, number | never is just number, and string | never is just string.

>

const name1: string = 'Amir';
const name2: string | never = name1;
name2;

Result:

'Amir'

>

function returnNumberOrNever(): number | never {
  return 1;
}

const n: number = returnNumberOrNever();
n;

Result:

1

This makes sense if we think about what the never type actually means. A never means "this can never actually have a value at runtime."

The type number | never means "it's either a number, or (a thing that can never actually have a value at runtime)". If the never part can never have a value, then there's no need for it to be part of the union. The TypeScript compiler knows that it can discard that possibility. It's kind of like how n + 0 is always just n, no matter what value n has.

This may remind you of something that we saw in an earlier lesson: if types X and Y don't share any possible values, then X&Y gives us never.

These are two separate rules about never. First, impossible intersections give us the type never. Second, never can be removed from any union.

On their own, unions with never aren't useful. For now, the only thing to know is that the never part of a union is always thrown away. However, in future lessons on more advanced types, unions with never are going to become very important!
