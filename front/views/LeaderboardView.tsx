import { Box, Heading, useBreakpointValue, ScrollView } from 'native-base';
import { useQuery } from 'react-query';
import User from '../models/User';
import { border } from 'native-base/lib/typescript/theme/styled-system';

const Leaderboardiew = () => {
    // const userQuery = useQuery(API.get)
    const TopTwentyQuery = [] as any[];
    const TopThreeQuery = [] as any[];
    return(
        <ScrollView>
            {TopThreeQuery.map((data) => (
                <Box rounded={'full'} borderWidth={1}>
                    data.name;
                </Box>
            ))}

            {TopTwentyQuery.map((data) => (
                <Box>
                    data.name;
                </Box>
            ))}
        </ScrollView>
    );
}

export default Leaderboardiew;