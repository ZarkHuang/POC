import 'fabric';

declare module 'fabric' {
    namespace fabric {
        interface Rect {
            id?: string;
        }
    }
}