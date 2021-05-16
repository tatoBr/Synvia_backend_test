# TOXICOLOGICAL SAMPLE ANALISER API
_This API allows you to catalog, view and analysis toxicological samples_

## ENDPOINTS

### Subscribe as a user
_>>POST /users_
>Allows an user to subscribe.
The request body needs to be in JSON format and include the following properties:
- `username` - **String** - Required;
- `email` - **String** - Required;
- `password` - **String** - Required;
 
_Example:_
```
POST /professionals

{
	"username": "phill675",
	"email": "philip@email.com",	
	"password": "aHuidy238OPJHhgd"	
}
```
_The response body will contain a message and the newly created Professional's id, username and email._<br><br>  

### Login in the system ###
_>>GET /users/login_
>Login user and creates its access token

The request body needs to be in JSON format and include the following properties:
- `email` - **String** - Required;
- `password` - **String** - Required;

_Exemple:_
```
GET /users/login

{
	"email": "paulo@company.com",
	"password": "aHuidy238OPJHhgd"
} 
```
_The response body will contain a message, the user's id and email, and an access token atached to the Authorization header._<br><br>  

### Submit and test a Sample
_>> POST  /samples_
>Allows to submit a new sample data and analyze it. Authorization is Required

The request body needs to be in JSON format and include the following properties:
- `codigo_amostra` - **String** - Required;
- `Cocaína` - **Float** - Required;
- `Anfetamina` - **Float** - Optional;
- `Metanfetamina` - **Float** - Required;
- `MDA` - **Float** - Required;
- `MDMA` - **Float** - Required;
- `THC` - **Float** - Required;
- `Morfina` - **Float** - Required;
- `Codeína` - **Float** - Required;  
- `Heroína` - **Float** - Required;  
- `Benzoilecgonina` - **Float** - Required;  
- `Cocaetileno` - **Float** - Required;  
- `Norcocaína` - **Float** - Required;


*Example:*
```
POST /samples
Authorization: Bearer <YOUR TOKEN>

{
    "codigo_amostra": "32548756",
    "Cocaína": 0.5,
    "Anfetamina": 0.2,
    "Metanfetamina": 0.1,
    "MDA": 0.1,
    "MDMA": 0,
    "THC": 0.04,
    "Morfina": 0.1,
    "Codeína": 0.1,
    "Heroína": 0.1,
    "Benzoilecgonina": 0.05,
    "Cocaetileno": 0,
    "Norcocaína": 0
}
```
_The response body will contain a message and the sample anaysis result_<br><br>

### Get all samples
_>>GET /samples_
>Allows any user to get a list of tested analysis. Authorization is Required

The request body needs to be empty:
_Example:_
```
GET /samples
Authorization: Bearer <YOUR TOKEN>
```
_The response body will contain a message and a list if tested samples and its anaysis result_<br><br>
