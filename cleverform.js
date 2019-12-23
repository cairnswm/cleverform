;(function($) {

    // Creates a form defined by JSON
    $.CleverForm = function(el, options) {

        var defaults = {
            name: "form",
            class: "",
            form: [],
            SubmitButton: {Class:"",Name:"submit", label: "Save Button"},

            onFormCreated: function() {},
            onFormSubmit: function(data) { },
            onCannotLoadData: function (data) {}
        }

        var CleverForm = this;

        CleverForm.settings = {}
        // Store the cached option values
        var Lookups = [];

        // **** Initialisation Method ****
        var init = function() {
            CleverForm.settings = $.extend({}, defaults, options);
            CleverForm.el = el;
            LoadAllOptions();

            DisplayForm();
            LoadInternalEvents();
        }

        // **** Public Methods ****
        // show the form with field populated by values in Data (an array)
        CleverForm.ShowForm = function(data)
        {
            DisplayForm(data);
        }

        // **** Private Methods ****
        var createSelect = function(field, value, readOnly, visible)
        {
            // Check the options has been loaded... else load
            if (Lookups[field.options] == undefined || Lookups[field.options].length == 0) {
                LoadOptions(field.options);
            }
            select = "";
            if (readOnly || (field.readonly != undefined && field.readonly) && record != undefined) {
                select = CreateInput(field, record, readOnly, GetOption(col.options, record[col.name]), visible);
            }
            else {
                select = '<select id="' + CleverForm.name + "-"+field.name+'" class="form-control"';
                if (readOnly || (field.readonly != undefined && field.readonly)) {
                    select = select + 'readonly ';
                }
                select = select + ">";
                $.each(Lookups[field.options], function (index, item) {
                    select = select + "<option value='" + item.id + "'";
                    if (value != undefined && value == item.id) {
                        select = select + "selected";
                    }
                    select = select + ">" + item.name + "</option>";
                });
                // row = row + '<input class="form-control" type="input" placeholder="Email" value="' + record[col.name] + '"/>';
                select = select + "</select>";
            }
            return select;
        }       
        var createInput = function(field, value, readonly)
        {
            $input = '<input class="' + field.Class + '" id="' + CleverForm.settings.name + '-' + field.Name + '" type="'+field.type+'" name="' + field.Name + '" value="'+value+'"';
            if ((field.required != undefined) && (field.required == true))
                { $input +=' required'; }
                if (readonly || (field.readonly != undefined && field.readonly))
                { $input +=' readonly'; }
            $input += '></input>';
            return $input;
        }
        var createField = function(field, value, readonly,)
        {
            if (field.type == undefined) { field.type = "text" }
            if (CleverForm.settings.LabelClass == undefined) { CleverForm.settings.LabelClass = "" }            
            if (CleverForm.settings.ContainerClass == undefined) { CleverForm.settings.ContainerClass = "" }
            
            $field = '<div class="form-group">';
            $field += '<label class="'+CleverForm.settings.LabelClass+'" for="' + CleverForm.settings.name + '-' + field.Name + '">' + field.Title + '</label>';
            $field += '<div class="'+CleverForm.settings.ContainerClass+'">';
            if (field.type == "select")
            { $field += createSelect(field, value, readonly, true); }
            else
            { $field += createInput(field, value, readonly); }
            $field += '</div>';
            $field += '</div>';
            return $($field);
        }        
        var createButton = function(button, readonly)
        {
            if (button.type == undefined) { button.type = "submit" }
            $input = $('<input type="'+button.type+'" class="btn-submit ' + button.Class + '" id="button-' + button.Name + '" value="'+button.label+'">');
            return $input;
        }
        var FormSubmit = function()
        {
            var data = $("form").serialize();
            CleverForm.settings.onFormSubmit(data);            
            return false;
        }
        var DisplayForm = function(data, readonly)
        {
            if (data == undefined) { data = []; }            
            if (readonly == undefined) { readonly = false; }
            mainDiv = $("<form class='"+CleverForm.settings.class+" "+CleverForm.settings.name+"'></form>");
            mainDiv.class = CleverForm.settings.name;
            if (CleverForm.settings.Title != undefined)
            {
                header = document.createElement("h1");
                $(header).text(CleverForm.settings.Title);
                mainDiv.append(header);
            }
            $.each(CleverForm.settings.form, function(index, input)
            {
                field = "";
                if (data[input.Name] != undefined) { field = data[input.Name]; }
                $(mainDiv).append(createField(input, field, readonly));
            });
            $(mainDiv).append(createButton(CleverForm.settings.SubmitButton));
            $(CleverForm.el).html(mainDiv);
        }
        var LoadInternalEvents = function () {
            $(document).on('submit','form.'+CleverForm.settings.name,function(){
                FormSubmit();
                return false; 
            });
        }
        var LoadAllOptions = function () {
            $.each(CleverForm.settings.form, function (index, field) {
                if (field.options !== undefined) {
                    LoadOptions(field.options);
                }
            });
            return true;
        }
        var LoadOptions = function (option)
        {
            if (option != undefined) {
                $.ajax({
                    method: "GET",
                    dataType: "json",
                    async: false,
                    url: option, //getURL(option),
                    data: {}
                })
                .done(function (data) {
                    rows = data; 
                    Lookups[option] = rows;

                    return 1;
                })
                .fail(function (data) {
                    console.log("error");
                    plugin.settings.onCannotLoadData(data);
                });
            }
            return 1;
        }
        var GetOption = function (option, id) {
            const found = (Lookups[option] != undefined);
            val = "";
            if (!found) {
                // Load from URL
                LoadOptions(option);
                $.each(Lookups[option], function (index, rec) {
                    if (rec.id == id) {
                        val = rec.name;
                    }
                });
            }
            else {
                $.each(Lookups[option], function (index, rec) {
                    if (rec.id == id) {
                        val =  rec.name;
                    }
                });
                return val;
            }
            return val;
        }
        

        init();

    }

    //PLUGIN_NAME = "Form";
    $.fn.CleverForm = function (options) {
        var item;
        this.each(function () {
            item = this;
            if (!$.data(this, "plugin_Form")) {
                $.data(this, "plugin_Form");
                item = new $.CleverForm(this, options);
            }
        });
        return item;
    }

})(jQuery);