import MessagesBlock from "../BrowzerBlocks/MessagesBlock/MessagesBlock";
import GoogleBlock from "../BrowzerBlocks/GoogleBlocks/GoogleBlock/GoogleBlock";

export const ContentBlockTypes = {
    'messages': {
        defaultTitle: 'Сообщения',
        Component: MessagesBlock
    },
    'google': {
        defaultTitle: 'Google',
        Component: GoogleBlock
    }
};