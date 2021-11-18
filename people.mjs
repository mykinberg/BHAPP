import fetch from 'node-fetch';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const fs = require('fs');

//Query API
const fetchPeople = async () => {
    try {
        const res = await fetch(`https://black-history-month-api.herokuapp.com/people`);
        const people = await res.json();
       // console.log(people[4]);

        var jsonContent = JSON.stringify(people);
        //console.log(jsonContent);
         
        fs.writeFile("peopleDB.json", jsonContent, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
         
            console.log("JSON file has been saved.");
        
        });
    }
    catch (error){
        console.log(`This is an error: ${error}`);
    }

}

fetchPeople();