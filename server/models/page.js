const mongoose=require('mongoose');

const employeeSchema=mongoose.Schema({
name:{
    type: String,
    required:true
},
email:{
    type: String,
    required:true
},
age:{
    type: Number,
    required:true
}
    
});
 const employeeModel=mongoose.model('employee',employeeSchema);

 module.exports = employeeModel;
