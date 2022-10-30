const form = document.querySelector("form"),
        nextBtn = form.querySelector(".nextBtn"),
        backBtn = form.querySelector(".backBtn"),
        submit = form.querySelector(".submit"),
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

function checkMobileNumber(b){  
    var a = /^\d{10}$/;  
    if (!a.test(b)){  
        alert("Mobile Number Is Not Valid.");        
    }   
}

function show(box) {
    var chboxs = document.getElementById("check");
    var vis = "none";
    if(chboxs.checked)
    {
        vis = "block";
    }
    document.getElementById(box).style.display = vis;


}

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
}

function clickAlert(){
    alert('New user registered!');
    
}