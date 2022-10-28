const form = document.querySelector("form"),
        verifyBtn = form.querySelector(".verifyBtn"),
        nextBtn = form.querySelector(".nextBtn"),
        backBtn = form.querySelector(".backBtn"),
        allInput = form.querySelectorAll(".first input");


nextBtn.addEventListener("click", ()=> {
    allInput.forEach(input => {
        if(input.value != ""){
            form.classList.add('secActive');
        }else{
            form.classList.remove('secActive');
        }
    })
})

backBtn.addEventListener("click", () => form.classList.remove('secActive'));


function getAge() {
    var today = new Date();
    var birthDate = new Date(document.getElementById('bdate').value);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    if(age<0){
        alert("Invalid Input!");
    }
    else{
        document.getElementById('age').value = age.toString();
    }
}

function enableNum() {
    document.getElementById("next").disabled = false;
}

function checkMobileNumber(b){  
    var a = /^\d{10}$/;  
    if (!a.test(b)){  
        alert("Mobile Number Is Not Valid.");        
    }   
    /*else{  
        alert("Mobile Number Is Valid.");
    }*/
}