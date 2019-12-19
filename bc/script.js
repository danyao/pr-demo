const method = {
  supportedMethods: "basic-card"
}
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
  requestPayerName: true,
  requestPayerEmail: true,
  requestPayerPhone: true,
  requestShipping: true,
};

var request;

function onload() {
  request = new PaymentRequest([method], details, options);
  request.onshippingaddresschange = (e) => {
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
  };
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
  });
}
