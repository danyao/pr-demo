const basicCardMethod = {
  supportedMethods: 'basic-card'
};
const googlePayMethodv1 = {
  supportedMethods: 'https://google.com/pay',
  data: {
    //environment: 'TEST',
    apiVersion: 1,
    allowedPaymentMethods: ['TOKENIZED_CARD', 'CARD'],
    cardRequirements: {
      'allowedCardNetworks': ['VISA', 'MASTERCARD', 'AMEX'],
    },
    merchantName: 'Danyao PR Test',
    merchantId: '09801497868661998886',
    paymentMethodTokenizationParameters: {
      tokenizationType: 'GATEWAY_TOKEN',
      parameters: {
        'gateway': 'stripe',
        'stripe:publishableKey': 'pk_live_lNk21zqKM2BENZENh3rzCUgo',
        //'gatewayMerchantId': 'exampleGatewayMerchantId'
        'stripe:version': '2016-07-06',
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
  },
  shippingOptions: [
    {
      id: "free-shipping",
      label: "Free Shipping",
      amount: {
        currency: "USD",
        value: "0.00",
      },
      selected: true,
    }
  ],
}
const options = {
  requestShipping: true,
  requestPayerEmail: true,
  requestPayerName: true,
  requestPayerPhone: true,
};

var request;

function onload() {
  request = new PaymentRequest([basicCardMethod, googlePayMethodv1], details, options);
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
  
  document.querySelector('#buy').style.display = 'none';
  request.show().then(response => {
    document.querySelector('#response').innerText = JSON.stringify(response.toJSON(), null, 2);
    response.complete();
  })
  .catch(e => {
    console.log('Error: ', e);
  });
}
