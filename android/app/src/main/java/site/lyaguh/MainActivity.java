package site.lyaguh;

import android.content.pm.ApplicationInfo;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.webkit.WebView;

import androidx.core.view.WindowCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final int SPOT_BACKGROUND_COLOR = Color.parseColor("#051634");

    @Override
    public void onCreate(Bundle savedInstanceState) {
        setTheme(R.style.AppTheme_NoActionBar);
        configureWebViewDebugging();
        super.onCreate(savedInstanceState);
        configureSystemBars();
    }

    private void configureWebViewDebugging() {
        boolean isDebuggable = (getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0;
        WebView.setWebContentsDebuggingEnabled(isDebuggable);
    }

    private void configureSystemBars() {
        Window window = getWindow();

        WindowCompat.setDecorFitsSystemWindows(window, true);
        window.setStatusBarColor(SPOT_BACKGROUND_COLOR);
        window.setNavigationBarColor(SPOT_BACKGROUND_COLOR);

        View decorView = window.getDecorView();
        int systemUiVisibility = decorView.getSystemUiVisibility();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            systemUiVisibility &= ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            systemUiVisibility &= ~View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
        }

        decorView.setSystemUiVisibility(systemUiVisibility);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            window.setStatusBarContrastEnforced(false);
            window.setNavigationBarContrastEnforced(false);
        }
    }
}
