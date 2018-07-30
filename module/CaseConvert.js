exports.upFirst=function(s) {
    if(s.length==0) return s;
    return s[0].toUpperCase()+s.slice(1);
}

exports.downFirst=function(s) {
    if(s.length==0) return s;
    return s[0].toLowerCase()+s.slice(1);
}