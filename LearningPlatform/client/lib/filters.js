
//expresion regular para identificar hipervinculos.
//var siesweb=/^(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)( [a-zA-Z0-9\-\.\?\,\'\/\\\+&%\$#_]*)?$/i.exec(cadena);
ellipsis = function(s,max){
    return (s.length > max) ? s.slice(0,max) + "..." : s;
};

smartDate = function(date){
    return moment(date).fromNow();
};
