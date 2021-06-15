import { ReactElement, cloneElement } from "react";
import { useRouter } from 'next/router';
import Link, { LinkProps } from "next/link";

interface ActiveLinkProps extends LinkProps {
  activeClassName: string;
  children: ReactElement;
}

export function ActiveLink({ activeClassName, children, ...rest }: ActiveLinkProps) {
  const { asPath } = useRouter();

  const className = asPath === rest.href ? activeClassName : '';

  return (
    <Link {...rest}>
      {
        cloneElement(children, {
          className,
        })
      }
    </Link>
  );
}
