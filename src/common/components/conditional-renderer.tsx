import React, {ReactNode, Suspense} from "react";

export const ConditionalRenderer: React.FC<{
    condition: boolean;
    children: ReactNode;
    fallback?: ReactNode;
}> = ({condition, children, fallback}) => {
    return (
        <Suspense fallback={fallback}>
            {condition ? children : fallback}
        </Suspense>
    )
}