import UsersSearch from "./searchComponents/users/UsersSearch";
import MusicSearch from "./searchComponents/music/MusicSearch";

export default [
    {
        name: 'all',
        queriesComponents: [
            UsersSearch,
            MusicSearch
        ]
    },
    {
        name: 'users',
        queriesComponents: [UsersSearch],
    },
    {
        name: 'music',
        queriesComponents: [MusicSearch]
    }
]