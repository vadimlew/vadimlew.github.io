export default class TextParser {
    static words = {
        'for': '#c695c6',
        'while': '#c695c6',
        'function': '#c695c6',
        '.log': '#86b9eb',
        '\\(': '#da70d6',
        '\\)': '#da70d6',
        '\\[': '#da70d6',
        '\\]': '#da70d6',
        '{': '#ffd711',
        '}': '#ffd711',        
        'let': '#c695c6',
        '=': '#f97b58',
        ';': '#a6acb9',
        "'(.*?)'": '#99c794',
        "[ |\n](.*?)\\(\\)": '#86b9eb'
    }      
    
    static parse (text) {
        let colors = [];       

        for (let prop in this.words) {             
            let matches = text.matchAll(prop);
            let next = matches.next();
            while (!next.done) {
                let index = next.value.index;
                let fill = this.words[prop];
                let txt = next.value[0];               
                colors.push( {fill, range:[index, index + txt.length-1]} );
                next = matches.next();
            }
        }

        return colors;
    }    
}