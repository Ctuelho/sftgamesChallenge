function Distance2D (coords){
    if(coords.length != 4){
        return -1;
    }
    var distance = Math.sqrt(
        pow((coords[0] - coords[2]), 2) + pow((coords[1] - coords[3]), 2)
    );

    return distance;
}

function LerpFloat(start, end, percent){
     return (start + percent*(end - start));
}


export { Distance2D, LerpFloat };