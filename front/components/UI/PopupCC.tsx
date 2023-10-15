import { Text, Row, Heading, Column } from 'native-base';
import ButtonBase from './ButtonBase';
import { CloseSquare } from 'iconsax-react-native';
import { BlurView } from 'expo-blur';
import { ReactNode } from 'react';
import Modal from "react-native-modal";
import React from 'react';
import GlassmorphismCC from './Glassmorphism';

type PopupCCProps = {
    title: string,
    description?: string,
    children?: ReactNode,
    isVisible: boolean,
    setIsVisible: (isVisible: boolean) => void,
};

const PopupCC = ({ title, description, children, isVisible, setIsVisible }: PopupCCProps) => {
	return (
        <Modal
            backdropOpacity={0.75}
            isVisible={isVisible}
            style={{
                display: 'flex',
                alignContent: 'center',
                alignSelf: 'center',
                alignItems: 'center'
            }}
        >
            <GlassmorphismCC>
                <Column
                    style={{
                        maxWidth: '800px',
                        maxHeight: 'fit-content',
                        padding: '20px',
                    }}
                    space={4}
                >
                    <Heading size="md" mb={2} alignItems={'flex-end'}>
                        <Row style={{flex: 1, width: '100%', alignItems: 'flex-end'}}>
                            <Text style={{flex: 1,width: '100%'}}>
                                {title}
                            </Text>
                            <ButtonBase
                                type='menu'
                                style={{width: 'fit-content'}}
                                icon={CloseSquare}
                                onPress={async () => setIsVisible(false)}
                            />
                        </Row>
                    </Heading>
                    {description &&
                        <Text>{description}</Text>
                    }
                    {children}
                </Column>
            </GlassmorphismCC>
        </Modal>
	);
};

export default PopupCC;
