const method = {
  supportedMethods: 'https://google.com/pay',
  data: {
    environment: 'TEST',
    apiVersion: 2,
    apiVersionMinor: 0,
    merchantInfo: {
      // A merchant ID is available after approval by Google.
      // @see {@link https://developers.google.com/pay/api/web/guides/test-and-deploy/integration-checklist}
      // merchantId: '01234567890123456789',
      merchantName: 'Example Merchant'
    },
    allowedPaymentMethods: [{
      type: 'CARD',
      parameters: {
        allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
        allowedCardNetworks: ["AMEX", "DISCOVER", "JCB", "MASTERCARD", "VISA"],
        billingAddressRequired: true,
        billingAddressParameters: {
          //format: "FULL",
          phoneNumberRequired: true,
        },
      },
      tokenizationSpecification: {
        type: 'PAYMENT_GATEWAY',
        // Check with your payment gateway on the parameters to pass.
        // @see {@link https://developers.google.com/pay/api/web/reference/object#Gateway}
        parameters: {
          'gateway': 'example',
          'gatewayMerchantId': 'exampleGatewayMerchantId'
        },
      },
    }],
    transactionInfo: {
      currencyCode: "USD",
      totalPriceStatus: "FINAL",
      totalPrice: "50.00",
      totalPriceLabel: "Total",
    },
    emailRequired: true,
    shippingAddressRequired: true,
    shippingAddressParameters: {
      phoneNumberRequired: true,
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
const options = {
  requestShipping: true
};

var request;

function onload() {
  request = new PaymentRequest([method], details);
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

var retried = false;

function buy() {
  if (!request) {
    return;
  }
  
  document.querySelector('#buy').style.display = 'none';
  request.show().then(response => {
    document.querySelector('#response').innerText = JSON.stringify(response.toJSON(), null, 2);
    console.log(`show resolved: retried = ${retried}`);
    if (!retried) {
      let error = {error: 'Testing retry'};
      response.retry(error).then(() => {
        console.log('Retrying...');
        response.complete();
      });
    }
  })
  .catch(e => {
    console.log('Error: ', e);
  });
}
