declare namespace WordPress {

    interface User {
        id?: number;
        username?: string;
        name?: string;
        first_name?: string;
        last_name?: string;
        email?: string;
        url?: string;
        description?: string;
        link?: string;
        nickname?: string;
        slug?: string;
        /** Format: "2015-07-20T08:57:31+00:00" */
        registered_date?: string;
        roles?: string[]; /** FIXME */
        capabilities?: {
            [capability: string]: boolean;
        };
        extra_capabilities?: {
            [capability: string]: boolean;
        };
        avatar_urls?: {
            [size: string]: string;
        };
    }

}
