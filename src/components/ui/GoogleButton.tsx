import { GoogleLogin } from "@react-oauth/google";

export function GoogleButton({
  onSuccess,
}: {
  onSuccess: (token: string) => void;
}) {
  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={(resp) => {
          if (resp.credential) onSuccess(resp.credential);
        }}
        onError={() => {}}
        width="100%"
        theme="outline"
        shape="pill"
        text="continue_with"
        logo_alignment="left"
        ux_mode="popup"
        size="large"
      />
    </div>
  );
}
