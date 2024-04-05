import { Button, Card, Flex, Select, TextInput, Text, Badge} from '@mantine/core';
import { YearPickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';

import { useLocation } from 'react-router-dom';
import { Months } from '../../../utils/Types';

interface CheckoutProps {
}

function useQuery() {
    return new URLSearchParams(useLocation().search);
  }  
const Checkout: React.FC<CheckoutProps> = () => {
    let query = useQuery();
    let numOfTickets = query.get("amount");
    let ticketName = query.get("ticketName");
    let ticketPrice = query.get("Price");
    let eventName = query.get("event");

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
            cardNumber: (value) => (value.length < 1 ? "Please enter card number" : null),
            expirationMonth: (value) => (value.length < 1 ? "Please select month" : null),
            expirationYear: (value) => (value.length < 1 ? "Please select year" : null),
            cvv: (value) => (value.length < 1 ? "Please enter cvv" : null),
        },
      });

    const handleCheckoutSubmit = (values: any) => {
        console.log(values);
    }
      
    return (
        <div>
            <h1>Checkout</h1>
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
                w={"55rem"}
            >
                <Card p={"lg"}>
                    <form onSubmit={checkoutForm.onSubmit((values) => handleCheckoutSubmit(values))}>
                        <TextInput ml={"lg"} mr={"lg"}
                        label="Card Holder"
                        placeholder="Enter card holder name"
                        name="cardHolder"
                        size="md"
                        withAsterisk
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
                            data={Object.values(Months).map((month) => ({ value: month, label: month }))}
                            {...checkoutForm.getInputProps("expirationMonth")}
                        />

                        <YearPickerInput m={"10px"} w={"120px"}
                            label="Expiration Year"
                            placeholder="Select Year"
                            size="md"
                            mt={"0.5rem"}
                            withAsterisk
                            {...checkoutForm.getInputProps("expirationYear")}>
                            
                        </YearPickerInput>
                        </Flex>

                        <Flex justify={"center"}>
                           
                        </Flex>
                        
                        <br />
                        <Button type="submit" size="md" p={"10px"} radius={"md"}>
                            Purchase
                        </Button>
                        
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