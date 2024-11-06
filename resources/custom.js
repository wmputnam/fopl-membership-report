const toNameTitleCase = ( name) => { 
    const nameParts = name.split(" ");

    // console.log(nameParts);
    var newName = new String("");
    var pad = "";

    for( var s of nameParts) {
        if( s.includes("-")) {
            let sarr = s.split("-");
            let sarrMapped = sarr.map( (item) => item.slice(0,1).toUpperCase() + item.slice(1).toLowerCase() );
            let sModified = sarrMapped.join("-");
            newName = `${newName}${pad}${sModified}`;
        } else if(s.toLowerCase() === "and"){
            newName = `${newName}${pad}&`;
        } else if (["OD","MD"].includes(s)) {
            newName = `${newName}, ${s}`;
        } else if (["JR"].includes(s)) {
            newName = `${newName}, Jr.`;
        } else if (s.charAt(0) === '(' && s.charAt(s.length-1) === ')') {
            let parenName = toNameTitleCase(s.slice(1,-1));
            newName = `${newName}${pad}(${parenName})`;
        } else {
            newName = `${newName}${pad}${s.slice(0,1).toUpperCase()}${s.slice(1).toLowerCase()}`;
        }
        pad = " ";
    }
    return `${newName}`;
}

// console.log(toNameTitleCase("bill putnam"));

// ***

const fullNameData = (dataSetRow) => {
    if( dataSetRow["lastName"] !== null ) {
        var fullName = dataSetRow["firstName"] === null ? dataSetRow["lastName"] : dataSetRow["firstName"] + " " + dataSetRow["lastName"];
        return toNameTitleCase(fullName);
    } else {
        return "";
    }
};

const sepPat = new RegExp(/[,;]/g);
const emailPhoneData = ( dataSetRow) => {
    var emailVal = dataSetRow["email"] === null ? "" : dataSetRow["email"].toLowerCase().replaceAll("; ","\n");
    var phoneVal = dataSetRow["phone"] === null ? "" : dataSetRow["phone"].toLowerCase().replaceAll(sepPat," ").replaceAll(/\s+/g,"\n");
    return [emailVal,phoneVal].join("\n");
};

const paidThroughData = ( dataSetRow ) => {	
    // console.log(dataSetRow)
    var mmbVal = dataSetRow["mmb"] === null ? "vol" : dataSetRow["mmb"].toLowerCase();

	// var j = dataSetRow["joined"] === null ? "" : dataSetRow["joined"];
	
    var p = dataSetRow["paidThrough"] === null ? "" : dataSetRow["paidThrough"].toString().slice(2);
	switch(mmbVal) {
		case "":
   		case "vol":
   			return "VOL";
   			
		case "lm":
        case "ben":
		    var result = "LM";
    		return result;
		
        case "hlm":
                var result = "HLM";
                return result;

        default:
	    	var result = p;
    		return result;
	};
};

const addressData = ( dataSetRow ) => {

    if( dataSetRow["address"] !== null ) {
        var addrVal = dataSetRow["address"] === null ? "" : dataSetRow["address"];
        var unitVal = dataSetRow["unit"] === null ? "" : " "+dataSetRow["unit"];
        var stateVal = dataSetRow["state"] === null ? "" : dataSetRow["state"];
        var postalCodeVal = dataSetRow["postalCode"] === null ? "" : " "+dataSetRow["postalCode"].slice(0,5);
        return addrVal + unitVal + "\n" + stateVal + postalCodeVal;
    } else {
        return "";
    }
};

// #A0FBF9
// #D5D5D5

const dynamicQuery = ( o ) => {
    let queryExpression = { isActive: true };
    if(o.listType !== undefined && o.listType === "board"){
        queryExpression["lists"]={"$regex":"board","$options":"i"}
    }
    return JSON.stringify( queryExpression );
}