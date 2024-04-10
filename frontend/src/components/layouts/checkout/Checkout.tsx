import { Button, Card, Flex, Select, TextInput, Text, Badge, Loader} from '@mantine/core';
import { YearPickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';

import { useLocation, useNavigate } from 'react-router-dom';
import { Months } from '../../../utils/Types';
import UserBar from '../../user_bar/UserBar';
import { useContext, useState } from 'react';
import { userContext } from '../home/Home';
import Api from '../../../utils/Api';

interface CheckoutProps {
}

function useQuery() {
    return new URLSearchParams(useLocation().search);
  }  
const Checkout: React.FC<CheckoutProps> = () => {
    const { username } = useContext(userContext);
    const navigate = useNavigate();
    
    let query = useQuery();
    let ticketName = query.get("ticketName");
    let ticketIdQuery = query.get("ticketID");
    let ticketPrice = query.get("Price");
    let numOfTickets = query.get("amount");
    let  eventIDQuery = query.get("event");
    let eventName = query.get("name");

    const checkoutForm = useForm({
        initialValues: { 
            cardHolder: "",
            cardNumber: "",
            expirationMonth: "",
            expirationYear: "",
            cvv: "",
        },
        validate: {
            cardHolder: (value) => (value.length < 1 ? "Please enter card holder name" : null),
            cardNumber: (value) => {
                if (value.length < 1) {
                    return "Please enter card number";
                } else if (value.length !== 16) {
                    return "Card number must be 16 digits";
                }
                return null;
            },
            expirationMonth: (value) => (value.length < 1 ? "Please select month" : null),
            expirationYear: (value) => (value.length < 1 ? "Please select year" : null),
            cvv: (value) => {
                if (value.length < 1) {
                    return "Please enter CVV";
                } else if (value.length !== 3) {
                    return "CVV must be 3 digits";
                }
                return null;
            },
        },
      });
      const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleCheckoutSubmit = async (values: any) => {
        setIsLoading(true);
        const apiService = new Api();
        if(eventIDQuery === null || ticketIdQuery === null) return;
        
        let month = values.expirationMonth.toString();
        let year = values.expirationYear.getFullYear().toString().slice(-2);
        let expDateStr = `${month}/${year}`;
        const payload = {
            eventID: eventIDQuery,
            creditCardNum: values.cardNumber,
            holder: values.cardHolder,
            cvv: values.cvv,
            expDate: expDateStr,
            ticketId: ticketIdQuery,
            ticketPrice: Number(ticketPrice),
            quantity: Number(numOfTickets),
            eventName: eventName
        };
        const response = await apiService.processPayment(payload);
        if (response) {
            setIsLoading(false);
            alert("Payment Successful");
            const params = new URLSearchParams({
                id: response.data.saved_id,
                event: eventName || "",
                ticket: ticketName || "",
                price: ticketPrice || "",
                amount: numOfTickets || ""
            });
            navigate(`/success?${params.toString()}`);
            return;
        } else {
            alert("Payment Failed, please try again.");
            setIsLoading(false);
            return;
        }
    }
      
    return (
        <div>
            <h1>Checkout</h1>
            <UserBar username={username} goBack={true} ></UserBar>
            <Flex
                mih={50}
                bg="rgba(0, 0, 0, .3)"
                gap="md"
                justify={"space-around"}
                rowGap={"1rem"}
                columnGap={"1rem"}
                align="stretch"
                direction="row"
                wrap="wrap"
                p={"4rem"}
            >
                <Card p={"lg"}>
                    <form onSubmit={checkoutForm.onSubmit((values) => handleCheckoutSubmit(values))}>
                        <TextInput ml={"lg"} mr={"lg"}
                        label="Card Holder"
                        placeholder="Enter card holder name"
                        name="cardHolder"
                        size="md"
                        withAsterisk
                        error={checkoutForm.errors.cardHolder}
                         {...checkoutForm.getInputProps("cardHolder")}
                        required
                        />
                        <br />
                        <TextInput  ml={"lg"} mr={"lg"}
                        label="Card Number"
                        placeholder="Enter your card number"
                        name="cardNumber"
                        size="md"
                        withAsterisk
                        error={checkoutForm.errors.cardNumber}
                         {...checkoutForm.getInputProps("cardNumber")}
                        required
                        />
                        <br />
                        <TextInput  ml={"lg"} mr={"lg"}
                        label="CVV"
                        placeholder="Enter CVV"
                        name="cvv"
                        size="md"
                        withAsterisk
                        error={checkoutForm.errors.cvv}
                        {...checkoutForm.getInputProps("cvv")}
                        required
                        />
                        <br />

                        <Flex display={"flex"} direction={"row"}  ml={"lg"} mr={"lg"}>
                        <Select m={"10px"} w={"150px"}
                            label="Expiration Month"
                            placeholder="Select Month"
                            size="md"
                            mt={"0.5rem"}
                            withAsterisk
                            error={checkoutForm.errors.expirationMonth}
                            data={Object.values(Months).map((month) => ({ value: month, label: month }))}
                            {...checkoutForm.getInputProps("expirationMonth")}
                        />

                        <YearPickerInput m={"10px"} w={"120px"}
                            label="Expiration Year"
                            placeholder="Select Year"
                            size="md"
                            mt={"0.5rem"}
                            withAsterisk
                            error={checkoutForm.errors.expirationYear}
                            {...checkoutForm.getInputProps("expirationYear")}>
                            
                        </YearPickerInput>
                        </Flex>

                        <Flex justify={"center"}>
                           
                        </Flex>
                        
                        <br />
                        <Flex direction={"row"} justify={"center"}>
                        {isLoading ? (
                                <Loader size={"md"}/>
                            ) : (
                                <Button type="submit" size="md" p={"10px"} radius={"md"}>
                                Purchase
                                </Button>
                            )}  
                        </Flex>
                     
                        
                    </form>
                </Card>

                <Card p={"xl"} >
                    <h2 >Order Summary:</h2>
                    <br />
                    <Text size={"xl"} fw={800}>{eventName}</Text>
                    <Flex align={"center"} mt={"md"} direction={"column"}>
                    <Badge color="teal" size="lg" p={"md"} w={"10rem"}>
                        {numOfTickets} x {ticketName}
                    </Badge>

                    <Badge color="cyan" size="lg" p={"md"} mt={"md"} w={"10rem"}>
                        Total: {Number(numOfTickets) * Number(ticketPrice)} $
                    </Badge>
                    </Flex>
                  
                </Card>
            </Flex>
        </div>
    );
};

export default Checkout;