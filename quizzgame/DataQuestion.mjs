let text1 = 
`Что будет в консоли?

let a = 'a';

function foo() {
    console.log(a);
}

foo();`

let answers1 = ["a", "b", "c", "ничего"]; // 0


let text2 = 
`Что будет в консоли?

let a = 'a';

function foo(a = 'b') {
    console.log(a);
}

foo();`

let answers2 = ["a", "b", "c", "ничего"]; // 1


let text3 = 
`Что будет в консоли?

let a = 'a';

function foo(a = 'b') {
    console.log(a);
}

foo('c');`


let answers3 = ["a", "b", "c", "ничего"]; // 2


let text4 = 
`Что будет в консоли?

let a = 'a';

function foo(a = 'b') {
    a = 'e';
    console.log(a);
}

foo('c');`

let answers4 = ["a", "e", "b", "c"]; // 1


let text5 = 
`Что будет в консоли?

function foo(a = 'b') {
    let b = 'e';
    console.log(a);
}

foo('c');`

let answers5 = ["a", "e", "b", "c"]; // 3


let text6 = 
`Что будет в консоли?

function foo(a = 'b', b = 'e') {    
    console.log(b);
}

foo('c');`

let answers6 = ["e", "b", "a", "c"]; // 0


let text7 = 
`Что будет в консоли?

function foo(a = 'b', b = 'e') {    
    console.log(b);
}

foo('c', 'd');`

let answers7 = ["e", "b", "a", "d"]; // 3


let text8 = 
`Что будет в консоли?

function foo(a = 'b', b = a) {    
    console.log(b);
}

foo('c');`

let answers8 = ["c", "b", "a", "d"]; // 0


let text9 = 
`Что будет в консоли?

function foo() {    
    console.log(arguments.length);
}

foo('c', 'd', 'e');`

let answers9 = ["0", "c", "d", "3"]; // 3 


let text10 = 
`Что будет в консоли?

function foo() {    
    console.log(arguments[1]);
}

foo('c', 'd', 'e');`


let answers10 = ["0", "c", "d", "3"]; // 2


let text11 = 
`Что будет в консоли?

function foo() {    
    return 10;
}

function bar(a) {
    let b = a + foo();    
    console.log(b);
}

bar(20);`

let answers11 = ["10", "20", "30", "40"]; // 2


let text12 = 
`Что будет в консоли?

function foo(a) {    
    return a;
}

function bar(a) {
    let b = a + foo(30);    
    console.log(b);
}

bar(10);`

let answers12 = ["10", "20", "30", "40"]; // 3


let text13 = 
`Что будет в консоли?

function foo(a) {    
    return a + 10;
}

function bar(a) {
    let b = a + foo(30);    
    console.log(b);
}

bar(20);`

let answers13 = ["40", "50", "60", "70"]; // 2


let text14 = 
`Что будет в консоли?

function foo(a) {    
    return a;
}

function bar(a) {
    let b = a + foo(a);    
    console.log(b);
}

bar(20);`

let answers14 = ["40", "50", "60", "70"]; // 0


let text15 = 
`Что будет в консоли?

function foo(a) {    
    return a + 30;
}

function bar(a) {
    let b = a + foo(a);    
    console.log(b);
}

bar(10);`


let answers15 = ["40", "50", "60", "70"]; // 1


let text16 = 
`Что будет в консоли?

function foo(a) {    
    return a + 30;
}

function bar(a) {
    let b = a + foo(a*2);    
    console.log(b);
}

bar(10);`


let answers16 = ["40", "50", "60", "70"]; // 2


let text17 = 
`Что будет в консоли?

function foo(a) {    
    return a*2;
}

function bar(a) {    
    console.log(a);
}

bar( foo(10) );`


let answers17 = ["40", "30", "20", "10"]; // 2


let text18 = 
`Что будет в консоли?

function foo(a, b) {    
    return a - b;
}

function bar(a) {   
    a += a; 
    console.log(a);
}

bar( foo(50, 30) );`

let answers18 = ["40", "30", "20", "10"]; // 0


let text19 = 
`Что будет в консоли?

function foo(a, b) {    
    console.log(a - b);
}

function bar(a) {   
    return a + 5;
}

foo( bar(20), bar(10) );`

let answers19 = ["40", "30", "20", "10"]; // 3


let text20 = 
`Что будет в консоли?

function foo(a, b, c = a + b) {    
    console.log(c);
}

foo( 20, 10 );`

let answers20 = ["40", "30", "20", "10"]; // 1


export let questionsData = [
    {
        text: text1,            
        variants: answers1,
        correctId: 0
    },

    {
        text: text2,            
        variants: answers2,
        correctId: 1
    },

    {
        text: text3,            
        variants: answers3,
        correctId: 2
    },

    {
        text: text4,            
        variants: answers4,
        correctId: 1
    },

    {
        text: text5,            
        variants: answers5,
        correctId: 3
    },

    {
        text: text6,            
        variants: answers6,
        correctId: 0
    },

    {
        text: text7,            
        variants: answers7,
        correctId: 3
    },

    {
        text: text8,            
        variants: answers8,
        correctId: 0
    },

    {
        text: text9,            
        variants: answers9,
        correctId: 3
    },

    {
        text: text10,            
        variants: answers10,
        correctId: 2
    },

    {
        text: text11,            
        variants: answers11,
        correctId: 2
    },

    {
        text: text12,            
        variants: answers12,
        correctId: 3
    },

    {
        text: text13,            
        variants: answers13,
        correctId: 2
    },

    {
        text: text14,            
        variants: answers14,
        correctId: 0
    },

    {
        text: text15,            
        variants: answers15,
        correctId: 1
    },

    {
        text: text16,            
        variants: answers16,
        correctId: 2
    },

    {
        text: text17,            
        variants: answers17,
        correctId: 2
    },

    {
        text: text18,            
        variants: answers18,
        correctId: 0
    },

    {
        text: text19,            
        variants: answers19,
        correctId: 3
    },

    {
        text: text20,            
        variants: answers20,
        correctId: 1
    }   
]