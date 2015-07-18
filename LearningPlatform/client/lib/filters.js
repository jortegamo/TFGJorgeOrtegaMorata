
ellipsis = function(s,max){
    return (s.length > max) ? s.slice(0,max) + "..." : s;
};

smartDate = function(date){
    return moment(date).fromNow();
};
