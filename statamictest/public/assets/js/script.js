jQuery(document).ready(function($){

    var $payments2UsFormContainer = $('#payment2us-form-container');
    var $iframecontainer = $('body').find('.payment-details-slide');
    var $preloading = $('body').find('#preloading');

    //var $selectFrequency = $('body').find('#select-donation-frequency'); // Select Element
    //var selectedFrequency = $selectFrequency.find('option:selected'); // Default: Monthly
    //var donationFrequency = selectedFrequency.val();

   
    /**
    *** Validate Email Input
    **/
    function validateEmail($email) {
        var emailReg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return emailReg.test( $email );
    }


    /**
    *** Form Error
    **/
    var hasError = true;
    var isValid = false;

    function checkInputs() {

        //isValid = false;

        $('.form-control').filter('[required]').each(function() {

            if ( $(this).val() == '') {
    
                $('.slick-next').prop('disabled', true);
                $('.slick-dots li:nth-child(3) i').addClass('btn-disabled');

                if ( $(this).is('#email_address') ) {
                    $(this).siblings('.invalid-email').addClass('d-none');
                }

                isValid = false;
                hasError = true;
                return isValid;
            }

            $(this).next('.input-error').addClass('d-none');

            if ( $(this).is('#email_address') ) {
    
                if ( !validateEmail( $(this).val() ) ) {
                    $(this).siblings('.invalid-email').removeClass('d-none');
                    $(this).next('.input-error').addClass('d-none');
                    isValid = false;
                    hasError = true;
                    return isValid;
                }
                else {
                    $(this).next('.input-error').addClass('d-none');
                    $(this).siblings('.invalid-email').addClass('d-none');
                    isValid = true;
                    hasError = false;
                    return isValid;
                }
            }
        });
    
        if (isValid && !hasError) {
            $('.slick-next').prop('disabled', false);
            $('.slick-dots li:nth-child(3) i').removeClass('btn-disabled');
        }
        return isValid;
    }
        

    /**
    *** Form Slider
    **/
    $('#slick-slider').slick({
        dots: true,
        infinite: false,
        slidesToShow: 1,
        adaptiveHeight: true,
        appendDots: $('#form-steps'),
        fade: true,
        speed: 500,
        swipe: false,
        appendArrows: $('#arrow-container'),
        prevArrow: '<button type="button" class="slick-prev"><i class="bi bi-chevron-left"></i></button>',
        nextArrow: '<button type="button" class="slick-next">Next</button>',
        customPaging: function(slick,index) {
            return '<i class="btn">' + (index + 1) + '</i>';
        }
    }).init(function() {

        $('.slick-dots li:nth-child(1) i').text('').addClass('bi bi-currency-dollar');
        $('.slick-dots li:nth-child(2) i').text('').addClass('bi bi-person-fill');
        $('.slick-dots li:nth-child(3) i').text('').addClass('bi bi-credit-card-fill btn-disabled');

        isValid = false;
        hasError = true;

    }).on('beforeChange', function(event, slick, currentSlide, nextSlide){

        // 1st Slide
         if ( nextSlide == 0 ) {

            $preloading.hide();

            $('.slick-next').prop("disabled", false)
            .text("Donate $" + $('input[type="hidden"]#donation-amount').val() );

            if ( isValid && !hasError ) {
                $('.slick-dots li:nth-child(3) i').removeClass('btn-disabled');
            }

            $('.slick-next').prop("disabled", false);
            
         }
         
         // 2nd Slide
         if ( nextSlide == 1 ) {

            $preloading.hide();

            // Donating Amount

            $('#donating_amount').text("").append( 'Donating $' + $('#donation-amount').val() );

            // Disable Slider Next button

            if ( !isValid && hasError ) {
                $('.slick-next').text("Proceed").prop("disabled", true);
                $('.slick-dots li:nth-child(3) i').addClass('btn-disabled');

                isValid = false;
                hasError = true;
            }
            

            // Form Fields Restrictions

                // alphanum.js
                $('input#firstName, input#lastName').alpha();
                // $('input[type="tel"]').numeric({allowPlus : true});
                 $('input#state').alpha(); // State field
                 $('input#postalCode').numeric();


            // FORM VALIDATION START            
            
            $('#slick-slide01 .form-control').on('keyup', function() {                
                checkInputs();
            }).on('change', function() {
                checkInputs();
            });

            checkInputs();

            // FORM VALIDATION END
            
         }
         

         // 3rd Slide
         if ( nextSlide == 2 ) {

            $('.slick-dots li:nth-child(3) i').removeClass('btn-disabled');

            isValid = true;
            hasError = false;
            
            $preloading.show();

            const Donor = {
                salutation  : $('select#salutation').val(),
                firstName   : $('input#first_name').val(),
                lastName    : $('input#last_name').val()
            };
        
            const DonorContact = {
                email       : $('input#email_address').val(),
                mobilePhone : $('input#mobile_phone').val(),
                //phone       : $('input#phone').val()
            };
        
            const DonorAddress = {
                 suburb      : $('input#suburb').val(),
                 street      : $('input#address').val(),
                 state       : $('input#state').val(),
                 postcode    : $('input#postcode').val(),
                 country     : $('input#country').val()
            };
        
            const Donation = {
                donationAmount  : $('input#donation-amount').val(),
                //payFrequency    : $('input#donation-frequency').val(),
                //paymentBy       : $('input#PaymentBy').val(), // Individual(default)
                //paymentByName   : $('input#PaymentByName').val(),
            };

            // if ( Donation.paymentByName !== "" ) {
            //     Donation.paymentBy   = "Organisation"; // This text value should be EXACTLY matched with SalesForce
            // }
        
            const iframe = document.createElement('iframe');
                iframe.width = '100%';
                iframe.height = '1370';
                let merchant_url = $('#SalesForceFormUrl').val();
        
            const formURL = merchant_url    +
                '&hideContactDetails=true'  +
                '&HideTransDetails=true'   +
                '&hidePaymentNote=true'     +
                '&hidePaymentOverview=true' +
                '&Salutation='              + Donor.salutation +
                '&FirstName='               + Donor.firstName +
                '&LastName='                + Donor.lastName +
                '&Email='                   + DonorContact.email +
                '&MobilePhone='             + DonorContact.mobilePhone +
                // '&Phone='                   + DonorContact.phone +
                 '&MailingCity='             + DonorAddress.suburb +
                 '&MailingStreet='           + DonorAddress.street +
                 '&MailingState='            + DonorAddress.state +
                 '&MailingPostalCode='       + DonorAddress.postcode +
                 '&MailingCountry='          + DonorAddress.country +
                // '&PayFrequency='            + Donation.payFrequency +
                //'&PaymentBy='               + Donation.paymentBy +
                //'&PaymentByName='           + Donation.paymentByName +
                '&donationAmount='          + Donation.donationAmount;

            iframe.src = formURL;
            iframe.onload = function() {
                $preloading.hide();
            };

            $iframecontainer.html(iframe); // Load the iframe            

            //iFrameResize({ log: true },  'iframe' );
            console.log('isValid:', isValid);
            console.log('hasError:', hasError);
            // Access the input elements and retrieve their values
const salutation = $('select#salutation').val();
const firstName = $('input#first_name').val();
const lastName = $('input#last_name').val();
const emailAddress = $('input#email_address').val();
const mobilePhone = $('input#mobile_phone').val();
const donationAmount = $('input#donation-amount').val();

// Print out the values
console.log('Salutation:', salutation);
console.log('First Name:', firstName);
console.log('Last Name:', lastName);
console.log('Email Address:', emailAddress);
console.log('Mobile Phone:', mobilePhone);
console.log('Donation Amount:', donationAmount);
            
         }

    });


    /**
    *** Disable 3rd stage button
    **/
    $('.slick-dots li:nth-child(3) i').click(function() {
        if ( !isValid && hasError ) {
            return false;
        }
    });

    
    /**
    *** Donationation Frequency
    **/
        //console.log('Pay Frequency: ' + $('input[type="hidden"]#donation-frequency').val() );

    // $('button.donation-frequency').click(function() {

    //     var $this = $(this);

    //     if ( $this.is('.once') ) {

    //         donationFrequency = $this.val(); // Default "Once-off"
    //         $('div#donation-frequency').animate({"max-height": "0px"}, 400);

    //     } else if ( $this.is('.regular') ) {

    //         donationFrequency = $selectFrequency.find('option:selected').val();
    //         $payments2UsFormContainer.find('input[type="hidden"]#donation-frequency').val(donationFrequency);

    //         $('body').find('div#donation-frequency').animate({"max-height": "100px"}, 400);
    //         $('button.donation-frequency.once.selected').removeClass('selected');   
    //         $(this).addClass('selected');            
            
    //         $('.slick-list').css('height', 'auto');

    //         // On Change
    //         $selectFrequency.change(function() {

    //             donationFrequency = $(this).find('option:selected').val();
    //             $payments2UsFormContainer.find('input[type="hidden"]#donation-frequency').val(donationFrequency);

    //             console.log('Pay Frequency: Regular ' + $('input[type="hidden"]#donation-frequency').val() );

    //         });

    //     }

    //     $payments2UsFormContainer.find('input[type="hidden"]#donation-frequency').val(donationFrequency);
        
    //     if ( !$this.is('.selected') ) {
    //         $payments2UsFormContainer
    //         .find('button.donation-frequency.selected')
    //         .removeClass('selected');
    //         $this.addClass('selected');
    //     }

    //     console.log('Pay Frequency: ' + donationFrequency);

    // });


    /**
    *** Default Amount
    **/
    var defaultAmount = $('#suggested-amounts button.selected').val();
    $payments2UsFormContainer.find('input[type="hidden"]#donation-amount').val( defaultAmount );

    console.log( "Default Amount: " + $('#suggested-amounts button.selected').val() );


    /**
    *** Suggested Amounts
    **/
    $('.slick-next').text("Donate $" + defaultAmount);
    $('#suggested-amounts button').click(function() {

        if ( !$(this).is('.selected') ) {
            
            let donationAmount = $(this).val();            
            $(this).parent().find('.selected').removeClass('selected');
            $(this).addClass('selected');

            $payments2UsFormContainer.find('input[type="hidden"]#donation-amount').val(donationAmount);            
            $payments2UsFormContainer.find('input[type="number"]#other-amount').val('');

            $('.slick-next').text("Donate $" + donationAmount);

            console.log('Suggested Amount: ' + donationAmount);

        }        
    });
    
    
    /**
    *** Other amount input
    **/
    $payments2UsFormContainer.find('input[type="number"]#other-amount').keyup(function() {
        let otherAmount = $(this).val();

        $('#suggested-amounts').find('button.selected').removeClass('selected');
        $('input[type="hidden"]#donation-amount').attr("value", + otherAmount);

        $payments2UsFormContainer.find('.slick-next').text("Donate $" + otherAmount);
        console.log( "Custom amount: " + otherAmount );

    });
    
    
    /**
    *** Payment by Individual/Organisation
    **/
    // $('button#paymentByOrganization').click(function() {
    //     $('#organizationNameRow').animate({"max-height": "100px"}, 500).addClass('active');

    //     $(this).addClass('selected');
    //     $('button#paymentByIndividual.selected').removeClass('selected');
    //     $('input[type="hidden"]#PaymentBy').val("Organisation");

    //     $('.slick-list').css('height', 'auto');
    // });
    
    // $('button#paymentByIndividual').click(function() {
    //     $('#organizationNameRow').animate({"max-height": "0px"}, 500).removeClass('active');

    //     $(this).addClass('selected');
    //     $('button#paymentByOrganization.selected').removeClass('selected');
    //     $('input[type="hidden"]#PaymentBy').val("Individual");
    // });

    
    /**
    *** DataTools
    **/
    $('input[type="text"]#street').autocomplete({
        source: function( request, response ) {
            $.ajax({
                url: "https://kleber.datatoolscloud.net.au/KleberWebService/DtKleberService.svc/ProcessQueryStringRequest",
                dataType: "jsonp",
                type: "GET",
                contentType: "application/json; charset=utf-8",
                data: {
                    Method: "DataTools.Capture.Address.Predictive.AuPaf.SearchAddress",
                    AddressLine:request.term,
                    ResultLimit: "7",
                    SearchOption: " ",
                    RequestId: "",
                    RequestKey: $('#TemporaryRequestKey').val(),
                    DepartmentCode: " ",
                    OutputFormat: "json"
                },
                success: function( data ) {                            
                    
                    $.map(data.DtResponse.Result, function (item) {

                        response( $.map( data.DtResponse.Result, function( item ) {                                    
                            var Output = (item.AddressLine + ", " + item.Locality + ", " + item.State + ", " + item.Postcode);
                            
                            return {
                                label: Output,
                                value: Output,
                                Output: Output,
                                RecordId: item.RecordId,
                                AddressLine: item.AddressLine
                            };
                        }));
                        
                });

                }
            });
        },

        select: function( event, ui ) {
            $.ajax(
                {
                    url: "https://kleber.datatoolscloud.net.au/KleberWebService/DtKleberService.svc/ProcessQueryStringRequest",
                    dataType: "jsonp",                            
                    crossDomain: true,
                    data: {
                            OutputFormat:"json", RecordId:ui.item.RecordId, 
                            Method:"DataTools.Capture.Address.Predictive.AuPaf.RetrieveAddress", 
                            RequestKey: $('#TemporaryRequestKey').val()
                        },
                success: function (data)
                {
                    $.map(data.DtResponse.Result, function (item) 
                    {							
                        $('#street').val(ui.item.AddressLine);
                        $('#suburb').val(item.Locality);
                        $('#state').val(item.State);
                        $('#postalCode').val(item.Postcode);   
                    });
                }
            });
        },
    });

    $('.ui-widget').css({
        'max-width' : $('#payments2us').outerWidth() - 60
    });    
    

});