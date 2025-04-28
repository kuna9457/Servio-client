import React from 'react';

interface OrderConfirmationEmailProps {
  orderDetails: {
    transactionId: string;
    customerName: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod: string;
    dueDate?: string;
    qrCode?: string;
    upiLink?: string;
  };
}

const OrderConfirmationEmail: React.FC<OrderConfirmationEmailProps> = ({ orderDetails }) => {
  const isPayLater = orderDetails.paymentMethod === 'pay_later';

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#ffffff',
      color: '#333333'
    }}>
      {/* Header with Logo */}
      <div style={{
        textAlign: 'center',
        padding: '20px 0',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <img 
          src="https://your-logo-url.com/logo.png" 
          alt="Company Logo" 
          style={{
            maxWidth: '150px',
            height: 'auto'
          }}
        />
      </div>

      {/* Greeting */}
      <div style={{ padding: '20px 0' }}>
        <h1 style={{
          color: '#003B95',
          fontSize: '24px',
          marginBottom: '10px'
        }}>
          {isPayLater ? 'Order Confirmation - Pay Later' : 'Order Confirmation'}
        </h1>
        <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
          Dear {orderDetails.customerName},
        </p>
        <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
          {isPayLater 
            ? 'Thank you for your order! We\'ve received your order and will collect payment after service completion.'
            : 'Thank you for your order! We\'re excited to confirm that we\'ve received your payment for order #' + orderDetails.transactionId + '.'
          }
        </p>
      </div>

      {/* Order Summary */}
      <div style={{
        backgroundColor: '#f9fafb',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{
          color: '#003B95',
          fontSize: '20px',
          marginBottom: '15px'
        }}>
          Order Summary
        </h2>
        
        {/* Order Items */}
        <div style={{ marginBottom: '20px' }}>
          {orderDetails.items.map((item, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div>
                <p style={{ fontWeight: 'bold', margin: '0' }}>{item.name}</p>
                <p style={{ color: '#6b7280', margin: '0' }}>Quantity: {item.quantity}</p>
              </div>
              <p style={{ fontWeight: 'bold' }}>${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Order Total */}
        <div style={{
          borderTop: '2px solid #e5e7eb',
          paddingTop: '15px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            <span>Subtotal</span>
            <span>${orderDetails.subtotal.toFixed(2)}</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            <span>Tax (10%)</span>
            <span>${orderDetails.tax.toFixed(2)}</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 'bold',
            fontSize: '18px',
            color: '#003B95'
          }}>
            <span>Total</span>
            <span>${orderDetails.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div style={{
        backgroundColor: '#f9fafb',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{
          color: '#003B95',
          fontSize: '20px',
          marginBottom: '15px'
        }}>
          Payment Information
        </h2>
        <p style={{ marginBottom: '10px' }}>
          Payment Method: {orderDetails.paymentMethod === 'pay_later' ? 'Pay Later' : 'UPI Payment'}
        </p>
        
        {/* Pay Later Specific Information */}
        {isPayLater && orderDetails.qrCode && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h3 style={{
              color: '#003B95',
              fontSize: '18px',
              marginBottom: '15px'
            }}>
              Payment QR Code
            </h3>
            <p style={{ marginBottom: '15px' }}>
              Please use the QR code below to make the payment after service completion.
            </p>
            <img 
              src={orderDetails.qrCode} 
              alt="Payment QR Code" 
              style={{
                maxWidth: '200px',
                height: 'auto',
                margin: '0 auto',
                border: '1px solid #e5e7eb',
                padding: '10px',
                backgroundColor: '#ffffff'
              }}
            />
            {orderDetails.dueDate && (
              <p style={{ marginTop: '15px', color: '#6b7280' }}>
                Payment Due Date: {new Date(orderDetails.dueDate).toLocaleDateString()}
              </p>
            )}
            {orderDetails.upiLink && (
              <a
                href={orderDetails.upiLink}
                style={{
                  display: 'inline-block',
                  marginTop: '15px',
                  padding: '10px 20px',
                  backgroundColor: '#003B95',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: '4px'
                }}
              >
                Open in UPI App
              </a>
            )}
          </div>
        )}
      </div>

      {/* Next Steps */}
      <div style={{
        backgroundColor: '#f9fafb',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2 style={{
          color: '#003B95',
          fontSize: '20px',
          marginBottom: '15px'
        }}>
          Next Steps
        </h2>
        <ul style={{
          listStyleType: 'none',
          padding: '0',
          margin: '0'
        }}>
          <li style={{
            display: 'flex',
            alignItems: 'flex-start',
            marginBottom: '15px'
          }}>
            <span style={{
              backgroundColor: '#003B95',
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '10px',
              flexShrink: '0'
            }}>1</span>
            <span>Our team will contact you shortly to confirm the service schedule.</span>
          </li>
          <li style={{
            display: 'flex',
            alignItems: 'flex-start',
            marginBottom: '15px'
          }}>
            <span style={{
              backgroundColor: '#003B95',
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '10px',
              flexShrink: '0'
            }}>2</span>
            <span>An agent will be assigned to your order and their details will be shared with you.</span>
          </li>
          <li style={{
            display: 'flex',
            alignItems: 'flex-start'
          }}>
            <span style={{
              backgroundColor: '#003B95',
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '10px',
              flexShrink: '0'
            }}>3</span>
            <span>
              {isPayLater 
                ? 'Payment will be collected after the service is completed to your satisfaction.'
                : 'Your service will be scheduled and completed as per the agreed timeline.'
              }
            </span>
          </li>
        </ul>
      </div>

      {/* Additional Instructions for Pay Later */}
      {isPayLater && (
        <div style={{
          backgroundColor: '#fff7ed',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #fed7aa'
        }}>
          <h3 style={{
            color: '#c2410c',
            fontSize: '18px',
            marginBottom: '10px'
          }}>
            Important Payment Instructions
          </h3>
          <ul style={{
            listStyleType: 'disc',
            paddingLeft: '20px',
            margin: '0'
          }}>
            <li style={{ marginBottom: '8px' }}>
              Please keep the QR code safe for making the payment after service completion.
            </li>
            <li style={{ marginBottom: '8px' }}>
              Payment must be made before the due date to avoid any service interruptions.
            </li>
            <li style={{ marginBottom: '8px' }}>
              You can use any UPI app to scan the QR code and make the payment.
            </li>
            <li>
              In case of any issues with the QR code, you can use the UPI link provided above.
            </li>
          </ul>
        </div>
      )}

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '20px 0',
        borderTop: '1px solid #e5e7eb',
        color: '#6b7280',
        fontSize: '14px'
      }}>
        <p>If you have any questions, please contact our customer support team.</p>
        <p style={{ marginTop: '10px' }}>
          © {new Date().getFullYear()} Your Company Name. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmationEmail; 