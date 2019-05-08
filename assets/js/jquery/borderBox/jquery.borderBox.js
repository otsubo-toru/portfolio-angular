$.fn.borderBox = function(force){
    var s = document.documentElement.style, box, getNum;
    if ( force || ( s.maxHeight !== undefined && 
    s.boxSizing === undefined && s.msBoxSizing === undefined &&
    s.MozBoxSizing === undefined && s.WebkitBoxSizing === undefined ) ){
        getNum = function(str){
            return Number(str.replace(/[a-zA-Z]+$/,""));
        };
        this.each( function(){
            box = $( this );
            if( box.css("width") !== "auto" ){
                box.width(
                    box.width() -
                    getNum( box.css("paddingLeft") ) - 
                    getNum( box.css("paddingRight") ) -
                    getNum( box.css("borderLeftWidth") ) - 
                    getNum( box.css("borderRightWidth") )
                );
            }
            if( box.css("height") !== "auto" ){
                box.height(
                    box.height() - 
                    getNum( box.css("paddingTop") ) - 
                    getNum( box.css("paddingBottom") ) -
                    getNum( box.css("borderTopWidth") ) - 
                    getNum( box.css("borderBottomWidth") )
                );
            }
        });
        return true;
    } else {
        return false;
    }
};
