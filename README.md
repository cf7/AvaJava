# AvaJava

// Combination of CoffeScript, Javascript, and OCaml
// Specifically to be able to have multiple conditionals in
// an if statement without having to restate "not 0" for each conditional

var addOdds = (x,y) -> if x%2 and y%2 both not 0 then x + y;
add 2 3;
// currying
