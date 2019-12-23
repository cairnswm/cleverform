# cleverform
jQuery Form plugin that creates a form based on JSON definition

# Usage
Create the Form object after loading javascript. 

```javascript
var Form = undefined; 

$(document).ready(function() {
    // create a new instance of the plugin
    Form = $('#element').Form({
        Title: "Default Form Title", 
        name: "default",
        form: [
            {Name:"Name", Title:"First Name", readonly: true},
            {Name:"Surname", Title:"Surname", readonly: true},
            {Name:"Email", Title:"eMail Address", type:"email", required:true},            
            {Name:"Phone", Title:"Phone Number", type:"phone"}, 
            {Name:"Birthday", Title:"Birthdate", type:"date"},
            {Name: "Selection", Title: "Selection", type: "select", options: "lookup.json" }
        ],
        onFormSubmit: function(data) {
            console.log(data);
            return false;
        }});
});
```

## Configuration Values

| Field         | Description          | 
| ------------- |------------          | 
| Title         | Displays an H1 above the form - if excluded no header is added to the form | 
| name          | added to the form name to allow multiple forms per page                    |   
| class         | Class is added to the Form element                                         |    
| LabelClass    | Added to the Input label element                                           |
| ContainerClass | added to the div container around the input element                       |
| InputClass     | Added to each input item created                                          |
| SubmitButton   | Definition of the input button to submit the form                         |
| form           | Array of elements to create as input fields                               |
| onFormSubmit   | Called when form is submitted - by pressing the submit button             |
| onFormCreated  | Called after form is created and added to DOM                             |
| onCannotLoadData | Called if data cannot be loaded (for Select options)                    |

## SubmitButton

| Field         | Description          | 
| ------------- |------------          | 
| Class         | Class added to button element |
| Name          | Name and Id of button         |
| label         | Text displayed on button      |

## Fields
| Field         | Description          | 
| ------------- |------------          | 
| Name          | Name to use for the input element (and returned in submit data)                     | 
| Title         | Label for the input element                                                         |
| type          | HTML5 type for the element - select to display a select box                          |
| options       | The list of options to display in the select box, if a URL then will be called and cached |

### Options

Format for the options field is
```json
[
{ "id": 1, "name": "Yes"},
{ "id": 2, "name": "No"}
]
```

if a url is set it will be called and should return data in the same { id: , name: } format

# Examples

## jqueryjs.html

Displays a basic html form without any styling

## bootstrapcss.html

Displays a form styles with Bootstrap CSS.

## bootstrapcss2.html

Displays a form using Bootstrap CSS but with additional styling to display forms in a horizontal layout

# Why?

I created this as I needed it for form display in a project. In the end I used another plugin instead.

