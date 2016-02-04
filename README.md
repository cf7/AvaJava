#<b>Avajava</b>
<b>AvaJava is a compiler written in Javascript that translates Javascript to Python.</b> AvaJava combines the most interesting parts of famous languages such as Python, CoffeeScript, Javascript, OCAML, etc., and also provides a new selection of functions (<i>to come</i>).  

####<i>Features/Planned Implementation (Subject to Change)</i>
Example Code:
<br>`var addOdds = (x,y) -> if x % 2 and y % 2 both not 0 then x + y;`<br> `add 3 3;`</br>
<br>`var factorial = (n) -> if n <= 1 then 1 else n * factorial(n - 1); //plain OCaml`</br>
<br>`factorial add 3 3;`</br>
######To Print:
`ava("Hello World!");` 
######To Compile & Run:
`guac hellowWorld.ava`
<br>`eat hellowWorld`

######Pointers:
`[x, y] = [1, 2, 3];`<br>
`x - 1`<br>
`y - 2`<br>

`x = 100;`<br>
`w = {y: 21, x, z: 22};`<br>
`w - {y: 21, x: 100, z: 22}`<br>

`[1..10] => [1,2,3,4,5,6,7,8,9]`<br>
`[1...10] => [1,2,3,4,5,6,7,8,9,10]`<br>

######Basic Operations:
`x,y = "hi";`<br>
`x - "hi"; `<br>
`y - "hi";` <br>
`x,y = 5;`<br>
`x - 5`<br>
`y - 5`<br>
`x++;`<br>
`x--;`<br>
`x^^2; //square x`<br>
`x^^3; //cube x`<br>
`x += 10;` <br>
`x -= 10;` <br>
`x *= 10;` <br>
`x /= 10;` <br>
`x % 2;` <br>
`'' = "";`<br>
`'' => '';` <br>
`"" => "";`<br>
`'' => "";`<br>
`"" => '';`<br>
`[x, y, z] = " hi";`<br>
`x - " ";`<br>
`y - "h";`<br>
`z - "i";`<br>
`[1,2,3] @ [4,5,6,7] = [1,2,3,4,5,6,7] = [1...7]`<br>
`[1,2,3]::[4,5,6,7] = [[1,2,3], [4,5,6,7]]`<br>
`[1,2,3]++ = [2,3,4]`<br>
`x and y`<br>
`x or y`<br>





