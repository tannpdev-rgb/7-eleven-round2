package com.tannpdev.backend.common.util;

import com.github.slugify.Slugify;

public class SlugUtil {
    private static final Slugify SLUGIFY = Slugify.builder().build();

    public static String generateSlug(String name) {
        if (name == null) return null;
        return SLUGIFY.slugify(name);
    }
}
