import {FC} from "react";
import styled from "styled-components";
import {Text} from "../../../../components/Text";

const StyledAbout = styled.div`
    padding: 10px 10px 10px 10px;
    width: 80%;
`;

const Title = styled.h2`
    color: ${props => props.theme.colors.cyanWhite};
    font-size: 32px;
    text-align: center;
`;

export const About: FC = () => {
    return (
        <StyledAbout>
            <Title>About me</Title>
            <Text>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ab deserunt dolor doloremque, enim
                error excepturi harum impedit, incidunt iste iure magnam molestias non quis rem sapiente sed unde,
                veniam. Dignissimos esse eveniet exercitationem hic ipsam obcaecati optio quam quasi qui voluptatem. A amet
                animi, commodi dignissimos dolorem eaque et illo incidunt iste laudantium natus praesentium
                recusandae repellat repellendus suscipit! Debitis fugit illum ipsa ipsam mollitia qui quos similique voluptates. Animi assumenda at,
                consequatur cupiditate dolor dolorem dolores ducimus eveniet, magni molestiae neque omnis provident,
                reiciendis sit tempore ullam veritatis! Atque beatae deserunt eaque fugit quo rerum ut voluptatem voluptatibus. Atque culpa deserunt,
                nostrum nulla possimus quod rem? Aperiam earum illo natus nemo sapiente. Exercitationem facilis
                magni nulla ut vero? Animi cumque debitis deserunt dicta dolorem ducimus ea eius facere itaque minus molestias
                necessitatibus nulla odio possimus, praesentium quam quas qui quidem recusandae sit temporibus
                tenetur vero, voluptate voluptates, voluptatum?
            </Text>
        </StyledAbout>
    )
}