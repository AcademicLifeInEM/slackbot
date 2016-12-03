
declare namespace Slack {

    type MessageEvent = 'ambient'|'message_received'|'direct_mention'|'direct_message'|'mention';
    /**
     * Enum of user levels
     * ura     = single channel guest
     * ra      = multi-channel guest
     * regular = regular user
     * admin   = admin user
     * owner   = team owner
     */
    type UserLevel = 'ura'|'ra'|'regular'|'admin'|'owner';

    type Scope = 'incoming-webhook'
        | 'commands'
        | 'bot'
        | 'users:read'
        | 'channels:write'
        | 'channels:history'
        | 'channels:read'
        | 'chat:write:bot'
        | 'chat:write:user'
        | 'dnd:write'
        | 'dnd:read'
        | 'emoji:read'
        | 'files:write:user'
        | 'files:read'
        | 'groups:write'
        | 'groups:history'
        | 'groups:read'
        | 'im:write'
        | 'im:history'
        | 'im:read'
        | 'mpim:write'
        | 'mpim:history'
        | 'mpim:read'
        | 'pins:write'
        | 'pins:read'
        | 'reactions:write'
        | 'reactions:read'
        | 'reminders:write'
        | 'reminders:read'
        | 'search:read'
        | 'stars:write'
        | 'stars:read'
        | 'team:read'
        | 'usergroups:write'
        | 'usergroups:read'
        | 'identity.basic'
        | 'users:write';

    interface AppConfig {
        clientId: string;
        clientSecret: string;
        redirectUri?: string;
        scopes: Scope[];
    }

    interface API {
        api_url: 'https://slack.com/api/';
        callAPI();
        callAPIWithoutToken();
        auth: {
            test();
        };
        oauth: {
            access();
        };
        channels: {
            archive();
            create();
            history();
            info();
            invite();
            join();
            kick();
            leave();
            list(obj: {}, cb: (err: Error, data: any) => void): void;
            mark();
            rename();
            setPurpose();
            setTopic();
            unarchive();
        };
        chat: {
            delete();
            postMessage();
            update();
        };
        emoji: {
            list();
        };
        files: {
            delete();
            info();
            list();
            upload();
        };
        groups: {
            archive();
            close();
            create();
            createChild();
            history();
            info();
            invite();
            kick();
            leave();
            list();
            mark();
            open();
            rename();
            setPurpose();
            setTopic();
            unarchive();
        };
        im: {
            close();
            history();
            list();
            mark();
            open();
        };
        mpim: {
            close();
            history();
            list();
            mark();
            open();
        };
        pins: {
            add();
            list();
            remove();
        };
        reactions: {
            add();
            get();
            list();
            remove();
        };
        rtm: {
            start();
        };
        search: {
            all();
            files();
            messages();
        };
        stars: {
            list();
        };
        team: {
            accessLogs();
            info();
        };
        users: {
            getPresence();
            info(arg: { user: string }, callback: (err: Error, response: { ok: boolean, user: User} ) => void ): void;
            list(obj: {}, cb: (err: Error, data: any) => void): void;
            setActive();
            setPresence();
        };
    }

    interface User {
        id: string;
        team_id: string;
        name: string;
        /** Has this user been deleted? */
        deleted: boolean;
        status: string;
        /** Hex color without # */
        color: string;
        /** User's full name */
        real_name: string;
        /** Timezone string (eg. America Indiana Indianapolis) */
        tz: string;
        /** Timezone label (eg. Eastern Daylight Time) */
        tz_label: string;
        tz_offset: number;
        profile: {
            first_name: string;
            last_name: string;
            avatar_hash: string;
            real_name: string;
            real_name_normalized: string;
            email: string;
            /** Encoded Gravatar URL 24x24 */
            image_24: string;
            /** Encoded Gravatar URL 32x32 */
            image_32: string;
            /** Encoded Gravatar URL 48x48 */
            image_48: string;
            /** Encoded Gravatar URL 72x72 */
            image_72: string;
            /** Encoded Gravatar URL 192x192 */
            image_192: string;
            /** Encoded Gravatar URL 512x512 */
            image_512: string;
        };
        is_admin: boolean;
        is_owner: boolean;
        is_primary_owner: boolean;
        is_restricted: boolean;
        is_ultra_restricted: boolean;
        is_bot: boolean;
        presence: string;
        has_2fa?: boolean;
    }

    interface Attachment {
        /** Required plain-text summary of the attachment */
        fallback?: string;
        /** Hex color string (including #) OR "good", "warning", or "danger" */
        color?: string;
        /** ID for callback (if using message buttons) */
        callback_id?: string;
        /** Used with message buttons -- not sure what this does FIXME */
        attachment_type?: 'default';
        /** Optional text that appears above the attachment block */
        pretext?: string;
        /** Small text used to display the author's name. */
        author_name?: string;
        /** URL for `author_name` Will only work if author_name is present. */
        author_link?: string;
        /**
         * URL that displays a small 16x16px image to the left of the `author_name` text.
         * Will only work if author_name is present.
         */
        author_icon?: string;

        /** The title is displayed as larger, bold text near the top of a message attachment. */
        title?: string;
        /** URL for title */
        title_link?: string;
        /**
         * Optional text that appears within the attachment.
         * The content will automatically collapse if it contains 700+ characters
         *   or 5+ linebreaks, and will display a "Show more..." link to expand the content.
         */
        text?: string;

        fields?: {
            /** Shown as a bold heading above the value text. Cannot contain markup */
            title: string;
            /** The text value of the field. It may contain standard message markup. May be multiline */
            value: string;
            /** An optional flag indicating whether the value is short enough to be displayed side-by-side with other values. */
            short: boolean;
        }[];

        actions?: {
            /**
             * Provide a string to give this specific action a name. The name will be returned
             *   to your Action URL along with the message's callback_id when this action is invoked.
             *   Use it to identify this particular response path. If multiple actions share the same name,
             *   only one of them can be in a triggered state.
             */
            name: string;
            /** The user-facing label for the message button representing this action. Cannot contain markup. Best to keep these short and decisive. */
            text: string;
            /** Provide nothing but button here. There are no other types of actions today. */
            type: 'button';
            /**
             * Provide a string identifying this specific action. It will be sent to your
             *   Action URL along with the name and attachment's callback_id. If providing multiple actions
             *   with the same name, value can be strategically used to differentiate intent.
             */
            value?: string;
            style?: 'default'|'primary'|'danger';
            /**
             * 	If you provide a JSON hash of confirmation fields, your button will pop
             * 	  up dialog with your indicated text and choices, giving them one last chance
             * 	  to avoid a destructive action or other undesired outcome.
             */
            confirm?: {
                title: string;
                text: string;
                ok_text: string;
                dismiss_text: string;
            };
        }[];

        /** URL to an image file that will be displayed inside a message attachment. GIF, JPEG, PNG, or BMP */
        image_url?: string;
        /** URL to an image file that will be displayed as a thumbnail on the right side of a message attachment. */
        thumb_url?: string;

        /**
         * Add some brief text to help contextualize and identify an attachment.
         * Limited to 300 characters, and may be truncated further when displayed
         *   to users in environments with limited screen real estate.
         */
        footer?: string;
        /** URL to 16x16 icon to display to left of footer */
        footer_icon?: string;
        /**
         * By providing the ts field with an integer value in UNIX format,
         *   the attachment will display an additional timestamp value as part
         *   of the attachment's footer.
         */
        ts?: number;

        /** Where to display markdown? */
        mrkdwn_in?: ('text'|'pretext'|'fields')[];
    }

    interface Identity {
        id: string;
        name: string;
        prefs: {
            // highlight_words: '',
            // user_colors: '',
            // color_names_in_list: true,
            // growls_enabled: true,
            // tz: null,
            // push_dm_alert: true,
            // push_mention_alert: true,
            // msg_replies: '{ "flexpane":false }',
            // push_everything: false,
            // push_idle_wait: 2,
            // push_sound: 'b2.mp3',
            // push_loud_channels: '',
            // push_mention_channels: '',
            // push_loud_channels_set: '',
            // email_alerts: 'instant',
            // email_alerts_sleep_until: 0,
            // email_misc: true,
            // email_weekly: true,
            // welcome_message_hidden: false,
            // all_channels_loud: false,
            // loud_channels: '',
            // never_channels: '',
            // loud_channels_set: '',
            // show_member_presence: true,
            // search_sort: 'timestamp',
            // expand_inline_imgs: true,
            // expand_internal_inline_imgs: true,
            // expand_snippets: false,
            // posts_formatting_guide: true,
            // seen_welcome_2: false,
            // seen_ssb_prompt: false,
            // spaces_new_xp_banner_dismissed: false,
            // search_only_my_channels: false,
            // emoji_mode: 'default',
            // emoji_use: '',
            // has_invited: false,
            // has_uploaded: false,
            // has_created_channel: false,
            // search_exclude_channels: '',
            // messages_theme: 'default',
            // webapp_spellcheck: true,
            // no_joined_overlays: false,
            // no_created_overlays: false,
            // dropbox_enabled: false,
            // seen_domain_invite_reminder: false,
            // seen_member_invite_reminder: false,
            // mute_sounds: false,
            // arrow_history: false,
            // tab_ui_return_selects: true,
            // obey_inline_img_limit: true,
            // new_msg_snd: 'knock_brush.mp3',
            // require_at: true,
            // ssb_space_window: '',
            // mac_ssb_bounce: '',
            // mac_ssb_bullet: true,
            // expand_non_media_attachments: true,
            // show_typing: true,
            // pagekeys_handled: true,
            // last_snippet_type: '',
            // display_real_names_override: 0,
            // display_preferred_names: true,
            // time24: false,
            // enter_is_special_in_tbt: false,
            // graphic_emoticons: false,
            // convert_emoticons: true,
            // autoplay_chat_sounds: true,
            // ss_emojis: true,
            // sidebar_behavior: '',
            // seen_onboarding_start: false,
            // onboarding_cancelled: false,
            // seen_onboarding_slackbot_conversation: false,
            // seen_onboarding_channels: false,
            // seen_onboarding_direct_messages: false,
            // seen_onboarding_invites: false,
            // seen_onboarding_search: false,
            // seen_onboarding_recent_mentions: false,
            // seen_onboarding_starred_items: false,
            // seen_onboarding_private_groups: false,
            // onboarding_slackbot_conversation_step: 0,
            // dnd_enabled: false,
            // dnd_start_hour: '22:00',
            // dnd_end_hour: '08:00',
            // mark_msgs_read_immediately: true,
            // start_scroll_at_oldest: true,
            // snippet_editor_wrap_long_lines: false,
            // ls_disabled: false,
            // sidebar_theme: 'default',
            // sidebar_theme_custom_values: '',
            // f_key_search: false,
            // k_key_omnibox: true,
            // speak_growls: false,
            // mac_speak_voice: 'com.apple.speech.synthesis.voice.Alex',
            // mac_speak_speed: 250,
            // comma_key_prefs: false,
            // at_channel_suppressed_channels: '',
            // push_at_channel_suppressed_channels: '',
            // prompted_for_email_disabling: false,
            // full_text_extracts: false,
            // no_text_in_notifications: false,
            // muted_channels: '',
            // no_macssb1_banner: false,
            // no_macssb2_banner: false,
            // no_winssb1_banner: false,
            // no_omnibox_in_channels: false,
            // k_key_omnibox_auto_hide_count: 0,
            // hide_user_group_info_pane: false,
            // mentions_exclude_at_user_groups: false,
            // privacy_policy_seen: true,
            // search_exclude_bots: false,
            // load_lato_2: false,
            // fuller_timestamps: false,
            // last_seen_at_channel_warning: 0,
            // flex_resize_window: false,
            // msg_preview: false,
            // msg_preview_displaces: true,
            // msg_preview_persistent: true,
            // emoji_autocomplete_big: false,
            // winssb_run_from_tray: true,
            // winssb_window_flash_behavior: 'idle',
            // two_factor_auth_enabled: false,
            // two_factor_type: null,
            // two_factor_backup_type: null,
            // enhanced_debugging: false,
            // mentions_exclude_at_channels: true,
            // confirm_clear_all_unreads: true,
            // confirm_user_marked_away: true,
            // box_enabled: false,
            // seen_single_emoji_msg: false,
            // confirm_sh_call_start: true,
            // preferred_skin_tone: '',
            // show_all_skin_tones: false,
            // separate_private_channels: false,
            // whats_new_read: 1465163646,
            // hotness: false,
            // frecency_jumper: '',
            // jumbomoji: true,
            // no_flex_in_history: true,
            // newxp_seen_last_message: 0,
            // attachments_with_borders: false,
            // sticky_unread_divider: false,
            // priority_sort: false,
            // custom_channel_sort: '',
            // a11y_font_size: 'normal'
        }; /** TODO */
        created: number;
        manual_presence: string;
    }

    interface TeamInfo {
        id: string;
        name: string;
        email_domain: string;
        domain: string;
        msg_edit_window_mins: number;
        prefs: TeamInfoPrefs;
        icon: {
            [id: string]: string;
        };
        over_storage_limit: boolean;
        plan: string;
        over_integrations_limit: boolean;
    }

    interface TeamInfoPrefs {
        default_channels: Object;
        display_real_names: boolean;
        posts_migrating: number;
        allow_calls: boolean;
        hide_referers: boolean;
        msg_edit_window_mins: number;
        allow_message_deletion: boolean;
        who_can_at_everyone: Slack.UserLevel;
        who_can_at_channel: Slack.UserLevel;
        who_can_create_channels: Slack.UserLevel;
        who_can_archive_channels: Slack.UserLevel;
        who_can_create_groups: Slack.UserLevel;
        who_can_post_general: Slack.UserLevel;
        who_can_kick_channels: Slack.UserLevel;
        who_can_kick_groups: Slack.UserLevel;
        retention_type: number;
        retention_duration: number;
        group_retention_type: number;
        group_retention_duration: number;
        dm_retention_type: number;
        dm_retention_duration: number;
        file_retention_duration: number;
        file_retention_type: number;
        allow_retention_override: boolean;
        require_at_for_mention: boolean;
        default_rxns: Object;
        team_handy_rxns: Object;
        channel_handy_rxns: Object;
        compliance_export_start: number;
        warn_before_at_channel: 'always';
        disallow_public_file_urls: boolean;
        who_can_create_delete_user_groups: Slack.UserLevel;
        who_can_edit_user_groups: Slack.UserLevel;
        who_can_change_team_profile: Slack.UserLevel;
        allow_shared_channels: boolean;
        who_has_team_visibility: Slack.UserLevel;
        invites_only_admins: boolean;
        disable_file_uploads: 'allow_all';
        who_can_create_shared_channels: Slack.UserLevel;
        who_can_post_in_shared_channels: Object;
        allow_shared_channel_perms_override: boolean;
        dnd_enabled: boolean;
        dnd_start_hour: string; // HH:MM
        dnd_end_hour: string; // HH:MM
        auth_mode: string;
        who_can_manage_integrations: Object;
    }

    interface Channel {
        id: string;
        name: string;
        is_channel: boolean;
        created: number;
        creator: string;
        is_archived: boolean;
        is_general: boolean;
        has_pins: boolean;
        is_member: boolean;
    }

    interface IMS {
        id: string;
        user: string;
        created: number;
        is_im: boolean;
        is_orig_shared: boolean;
        has_pins: boolean;
        /** Slack timestamp: 1010101010.101010 */
        last_read: string;
        /** Slack timestamp: 1010101010.101010 */
        latest: string;
        is_open: boolean;
    }

    interface Bot {
        id: string;
        deleted: boolean;
        name: string;
        icons: any;
    }

    interface RTMPayload {
        ok: boolean;
        cache_ts: number;
        cache_version: string;
        cache_ts_version: string;
        url: string;
        self: Identity;
        team: TeamInfo;
        subteams: {
            self: any[];
            all: any[];
        };
        dnd: {
            dnd_enabled: boolean;
            next_dnd_start_ts: number;
            next_dnd_end_ts: number;
            snooze_enabled: boolean;
        };
        channels: Channel[];
        ims: IMS[];
        users: User[];
        bots: Bot[];
        groups: any[];
    }

}
