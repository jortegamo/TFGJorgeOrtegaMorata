
//expresion regular para identificar hipervinculos.
//var siesweb=/^(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)( [a-zA-Z0-9\-\.\?\,\'\/\\\+&%\$#_]*)?$/i.exec(cadena);
ellipsis = function(s,max){
    return (s.length > max) ? s.slice(0,max) + "..." : s;
};

smartDate = function(date){
    return moment(date).fromNow();
};

smartNumber = function(num){
    var MIL = 1000;
    var MILLION = Math.pow(1000,2);
    var MIL_MILLION = Math.pow(1000,3);
    var BILLION = Matth.pow(1000,4);

    var unities = ['K','M','KM','B'];
    var unity = '';
    var snum = num;

    if (num >= BILLION) {
        unity = unities[3];
    }else if(num >= MIL_MILLION){
        unity = unities[2];
    }else if(num >= MILLION){
        unity = unities[1];
    }else if(num >= MIL){
        unity = unities[0];
    }
    return sNum + unity;
};
