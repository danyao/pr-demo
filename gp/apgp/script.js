/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

const method = {
  supportedMethods: 'https://google.com/pay',
  data: {
    environment: 'TEST',
    apiVersion: 1,
    allowedPaymentMethods: ['TOKENIZED_CARD', 'CARD'],
    cardRequirements: {
      'allowedCardNetworks': ['VISA', 'MASTERCARD', 'AMEX'],
      billingAddressRequired: true,
      billingAddressFormat: "FULL",
      billingAddressParameters: {
        phoneNumberRequired: true,
      }
    },
    merchantName: 'Danyao PR Test',
    paymentMethodTokenizationParameters: {
      tokenizationType: 'GATEWAY_TOKEN',
      parameters: {
        'gateway': 'example',
        'gatewayMerchantId': 'exampleGatewayMerchantId'
      },
    },
    emailRequired: true,
    shippingAddressRequired: true,
    shippingAddressParameters: {
      phoneNumberRequired: true,
    },
  },
};

const androidPayMethod = {
  supportedMethods: "https://android.com/pay",
  data: {
    environment: "TEST",
    merchantId: "09511744644598700896",
    allowedCardNetworks: ["AMEX", "MASTERCARD", "VISA"],
    billingAddressRequired: true,
    billingAddressFormat: "FULL",
    paymentMethodTokenizationParameters: {
      tokenizationType: "GATEWAY_TOKEN",
      parameters: {
        "gateway": "stripe",
        "stripe:publishableKey": "pk_test_PInFiPUnGR6pzLYZ2IE6oyPf",
        "stripe:version": "Stripe.js/AndroidPay"
      },
    },
  },
};

const details = {
  total: {
    label: "Total",
    amount: {
      currency: "USD",
      value: "50.00"
    }
  }
}

var request;

function onload() {
  request = new PaymentRequest([method, androidPayMethod], details);
  request.addEventListener('shippingaddresschange', e => {
    console.log("shipping address changed");
    e.updateWith({
      total: {
        label: "New Total",
        amount: {
          currency: "USD",
          value: "100.00"
        }
      },
      shippingOptions: [
        {
          id: "flat-shipping",
          label: "Flat shipping",
          amount: {
            currency: "USD",
            value: "5.00"
          },
          selected: true
        }
      ]
    });
  });
  request.canMakePayment().then(canMakePayment => {
    document.querySelector('#can').innerText = `Can make payment: ${canMakePayment}`;
  });
  request.hasEnrolledInstrument().then(has => {
    document.querySelector('#has').innerText = `Has enrolled instrument: ${has}`;
  });
}

function buy() {
  if (!request) {
    return;
  }
  
  request.show().then(response => {
    document.querySelector('#response').innerText = JSON.stringify(response.toJSON(), null, 2);
    response.complete();
  })
  .catch(e => {
    console.log('Error: ', e);
  });
}
