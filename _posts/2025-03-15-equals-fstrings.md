---
layout: post
title:  Python f-strings {expr=}
date:   2025-03-15
tag: til
---
I've been learning rust recently, and have loved the ease of the `dbg!` macro which will print and return the value of a given expression, along with the file and line number of where it was called. Since it returns the value of the expression it can be used inline. 

For [example](https://play.rust-lang.org/?version=stable&mode=debug&edition=2024&gist=65b0f0a6325cb1d758810c347ce3b697):

```rust
fn main() {
    let nums = vec![1, 2, 3, 4, 5];

    let doubled: Vec<_> = nums
        .iter()
        .map(|x| dbg!(x * 2))
        .collect();

    println!("Result: {:?}", doubled);
}
```
This will output:
```
[src/main.rs:6] x * 2 = 2
[src/main.rs:6] x * 2 = 4
[src/main.rs:6] x * 2 = 6
[src/main.rs:6] x * 2 = 8
[src/main.rs:6] x * 2 = 10
Result: [2, 4, 6, 8, 10]
```

It saves you having to make new variables just to debug what is in them, and gives you a nice amount of context.

Recently Jakub showed me that python has something very similar in the form of an `fstring` with an `=` specifier like so: `f"{expr=}"`. This will expand the expression and the value, and shows you which expression was evaluated. It saves you from having to notate your variable names when printing things out.

For example (from the [docs](https://docs.python.org/3/whatsnew/3.8.html#f-strings-support-for-self-documenting-expressions-and-debugging)):

```python
>>> from math import cos, radians
>>> theta = 30
>>> print(f'{theta=}  {cos(radians(theta))=:.3f}')
theta=30  cos(radians(theta))=0.866
```

While this doesn't give you the file and line-number context, it has now become my go-to way of printing things out when I'm doing print debugging in python.